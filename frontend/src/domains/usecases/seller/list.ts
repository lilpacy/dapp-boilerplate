import {ethers} from 'ethers';
import {
  marketplaceContract,
  marketplaceContractAddress,
  nftContract
} from "../../../lib/nftmarket";
import {signer,} from "../../../lib/ethereum";

export async function approve721() {
  await nftContract.setApprovalForAll(marketplaceContractAddress, true)
}

export async function list(): Promise<{signature: string, messageHash: string, txHash: string}> {
  const tokenId = 1; // 出品するNFTのトークンID
  const price = 100; // NFTを購入するために支払うERC20トークンの量

// EIP-712署名を作成する
  const domain = {
    name: 'NFTMarketplace',
    version: '1',
    chainId: 31337, // localhostのchain ID
    verifyingContract: marketplaceContractAddress,
  };
  const types = {
    Buy: [
      {name: 'tokenId', type: 'uint256'},
      {name: 'price', type: 'uint256'},
      {name: 'seller', type: 'address'},
    ],
  };
  const message = {
    tokenId: tokenId,
    price: price,
    seller: await signer.getAddress(),
  };
  const signature: string = await signer._signTypedData(domain, types, message);

// NFTを出品する
  const messageHash: string = ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ['string', 'bytes32'],
      ['\x19\x01', ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['bytes'], [signature]))]
    )
  );

  const txHash: string = (await marketplaceContract.list(tokenId, price, messageHash)).hash;
  return {signature, messageHash, txHash};
}
