import {
  NFTMarketplace__factory
} from '../../../contract/typechain-types/factories/contracts/NFTMarketplace__factory';
import {
  MyERC721__factory
} from '../../../contract/typechain-types/factories/contracts/MyERC721__factory';
import {
  MyERC20__factory
} from '../../../contract/typechain-types/factories/contracts/MyERC20__factory';
import {constants} from "../../constants";
import {signer} from "./ethereum";

export const nftContractAddress = constants.erc721Address; // ERC721トークンのコントラクトアドレス
export const erc20ContractAddress = constants.erc20Address; // ERC20トークンのコントラクトアドレス
export const marketplaceContractAddress = constants.marketAddress; // NFTMarketplaceのコントラクトアドレス

export const nftContract = MyERC721__factory.connect(nftContractAddress, signer);
export const erc20Contract = MyERC20__factory.connect(erc20ContractAddress, signer);
export const marketplaceContract = NFTMarketplace__factory.connect(marketplaceContractAddress, signer);
