import {
  erc20Contract,
  marketplaceContract,
  marketplaceContractAddress
} from "../../../lib/nftmarket";
import {constants} from "../../../../constants";

export async function approve20() {
  await erc20Contract.approve(marketplaceContractAddress, 100)
}

export async function buy() {
  const tokenId = 1; // 購入するNFTのトークンID
  const price = 100; // NFTを購入するために支払うERC20トークンの量

// 署名が有効であることを確認する
  const listing = await marketplaceContract.listings(tokenId);
  if (listing.isSold) {
    throw new Error('This NFT has already been sold');
  }
  if (!listing.price.eq(price)) {
    throw new Error('Invalid price');
  }
  // call buy method of marketplace contract
  await marketplaceContract.buy(tokenId, constants.signature);
}
