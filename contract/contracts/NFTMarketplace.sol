pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

import "hardhat/console.sol";

contract NFTMarketplace is EIP712 {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
        bytes32 messageHash;
        bool isSold;
    }
    bytes32 private constant _LISTING_TYPEHASH = keccak256("Buy(uint256 tokenId,uint256 price,address seller)");

    mapping(uint256 => Listing) public listings;

    IERC721 public nft;
    IERC20 public erc20;

    constructor(IERC721 _nft, IERC20 _erc20) EIP712("NFTMarketplace", "1"){
        nft = _nft;
        erc20 = _erc20;
    }

    function list(uint256 _tokenId, uint256 _price, bytes32 _messageHash) external {
        require(nft.ownerOf(_tokenId) == msg.sender, "You don't own this NFT");

        listings[_tokenId] = Listing({
        tokenId : _tokenId,
        price : _price,
        seller : msg.sender,
        messageHash : _messageHash,
        isSold : false
        });
    }

    function buy(uint256 _tokenId, bytes calldata _signature) external {
        Listing storage listing = listings[_tokenId];
        require(listing.isSold == false, "This NFT has already been sold");
        require(listing.price > 0, "This NFT is not for sale");

        bytes32 structHash = keccak256(abi.encode(
                _LISTING_TYPEHASH,
                listing.tokenId,
                listing.price,
                listing.seller
            ));
        bytes32 messageHash = _hashTypedDataV4(structHash);
        console.logBytes32(bytes32(_signature));
        console.logBytes32(messageHash);

        address seller = listing.seller;
        address buyer = msg.sender;
        console.log(seller);
        console.log(buyer);

        require(messageHash.recover(_signature) == seller, "Invalid signature");

        nft.safeTransferFrom(seller, buyer, listing.tokenId);
        erc20.safeTransferFrom(buyer, seller, listing.price);

        listing.isSold = true;
    }
}
