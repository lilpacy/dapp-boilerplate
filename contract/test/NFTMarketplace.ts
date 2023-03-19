import {expect} from "chai";
import {ethers} from "hardhat";
import {NFTMarketplace__factory} from "../typechain-types"
import {MyERC20__factory} from "../typechain-types";
import {MyERC721__factory} from "../typechain-types";
import {NFTMarketplace} from "../typechain-types";
import {MyERC20} from "../typechain-types";
import {MyERC721} from "../typechain-types";
import {BigNumber} from "@ethersproject/bignumber";
import {Wallet} from 'ethers'

const {keccak256} = ethers.utils;

describe("NFTMarketplace", () => {
  let nft: MyERC721;
  let erc20: MyERC20;
  let marketplace: NFTMarketplace;
  let owner: Wallet;
  let seller: Wallet;
  let buyer: Wallet;
  let ownerAddress: string;
  let sellerAddress: string;
  let buyerAddress: string;

  beforeEach(async () => {
    [owner, seller, buyer] = await (ethers as any).getSigners();
    [ownerAddress, sellerAddress, buyerAddress] = await Promise.all([owner.getAddress(), seller.getAddress(), buyer.getAddress()]);
    nft = await new MyERC721__factory(owner).deploy(sellerAddress);
    erc20 = await new MyERC20__factory(owner).deploy("1000", buyerAddress);
    marketplace = await new NFTMarketplace__factory(owner).deploy(nft.address, erc20.address);
  });

  it("success; should allow seller to list an NFT for sale", async () => {
    const tokenId = 1; // 出品するNFTのトークンID
    const price = 100; // NFTを購入するために支払うERC20トークンの量

// EIP-712署名を作成する
    const domain = {
      name: 'NFTMarketplace',
      version: '1',
      chainId: 31337, // localhostのchain ID
      verifyingContract: marketplace.address,
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
      seller: sellerAddress,
    };
    const signature: string = await seller._signTypedData(domain, types, message);
    console.log({signature})

    await nft.connect(seller).approve(marketplace.address, tokenId);
    await marketplace.connect(seller).list(tokenId, price);

    const listing = await marketplace.listings(tokenId);
    expect(listing.tokenId).to.equal(tokenId);
    expect(listing.price).to.equal(price);
    expect(listing.seller).to.equal(sellerAddress);
    expect(listing.isSold).to.equal(false);
  });

  it("success; should allow buyer to buy an NFT", async () => {
    const tokenId = 1; // 出品するNFTのトークンID
    const price = 100; // NFTを購入するために支払うERC20トークンの量

// EIP-712署名を作成する
    const domain = {
      name: 'NFTMarketplace',
      version: '1',
      chainId: 31337, // localhostのchain ID
      verifyingContract: marketplace.address,
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
      seller: sellerAddress,
    };
    const signature: string = await seller._signTypedData(domain, types, message);
    console.log({signature})

    await nft.connect(seller).approve(marketplace.address, tokenId);
    await marketplace.connect(seller).list(tokenId, price);

    await erc20.connect(buyer).approve(marketplace.address, price);
    await marketplace.connect(buyer).buy(tokenId, signature);

    const listing = await marketplace.listings(tokenId);
    expect(listing.isSold).to.equal(true);
    expect(await nft.ownerOf(tokenId)).to.equal(buyerAddress);
    expect(await erc20.balanceOf(sellerAddress)).to.equal(BigNumber.from("100"));
    expect(await erc20.balanceOf(buyerAddress)).to.equal(BigNumber.from("900"));
  });

  it("success; should allow seller to cancel listing", async () => {
    const tokenId = 1; // 出品するNFTのトークンID
    const price = 100; // NFTを購入するために支払うERC20トークンの量
 
    // EIP-712署名を作成する
    const domain = {
      name: 'NFTMarketplace',
      version: '1',
      chainId: 31337, // localhostのchain ID
      verifyingContract: marketplace.address,
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
      seller: sellerAddress,
    };
    const signature: string = await seller._signTypedData(domain, types, message);
    const hash = keccak256(signature)

    await nft.connect(seller).approve(marketplace.address, tokenId);
    await marketplace.connect(seller).list(tokenId, price);
    await marketplace.connect(seller).cancel(tokenId, signature);

    const canceled = await marketplace.canceled(hash);
    expect(canceled).to.equal(true)
  })

  it("failure; should not allow buyer to buy cancel listing NFT", async () => {
    const tokenId = 1; // 出品するNFTのトークンID
    const price = 100; // NFTを購入するために支払うERC20トークンの量

// EIP-712署名を作成する
    const domain = {
      name: 'NFTMarketplace',
      version: '1',
      chainId: 31337, // localhostのchain ID
      verifyingContract: marketplace.address,
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
      seller: sellerAddress,
    };
    const signature: string = await seller._signTypedData(domain, types, message);
    console.log({signature})

    await nft.connect(seller).approve(marketplace.address, tokenId);
    await marketplace.connect(seller).list(tokenId, price);

    await nft.connect(seller).approve(marketplace.address, tokenId);
    await marketplace.connect(seller).list(tokenId, price);
    await marketplace.connect(seller).cancel(tokenId, signature);

    await erc20.connect(buyer).approve(marketplace.address, price);
    expect(marketplace.connect(buyer).buy(tokenId, signature)).to.be.revertedWith("This order has been canceled");
  });
});
