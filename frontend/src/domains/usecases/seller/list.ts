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

export async function list() {
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


  const txHash: string = (await marketplaceContract.list(tokenId, price)).hash;
  return {signature, txHash};
}

export async function cancel() {
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

  const txHash: string = (await marketplaceContract.cancel(tokenId, signature)).hash;
  return {signature, txHash};
}
