// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract BeatMarket is ERC721URIStorage {
    uint private _tokenIdCounter = 0;
    uint private _itemSoldCounter = 0;

    address payable public immutable marketOwner;
    uint256 public immutable listingPrice;

    constructor() ERC721("Beat Store NFT", "BST") {
        marketOwner = payable(msg.sender);
        listingPrice = 0.025 ether;
    }

    struct MarketListing {
        uint256 tokenId;
        uint256 price;
        address payable seller;
        address payable owner;
        bool sold;
    }

    event MarketListingCreated(
        uint256 indexed tokenId,
        uint256 price,
        address seller,
        address owner,
        bool sold
    );

    event TokenMinted(
        uint256 tokenId,
        address owner, 
        string tokenURI, 
        uint256 price
    );

    event ItemPurchased(
        uint256 tokenId, 
        address buyer, 
        uint price
    );

    event ListingCancelled(
        uint256 indexed tokenId,
        address seller
    );

    mapping(uint256 => MarketListing) public marketListings;

    function mintNewToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        require(_tokenIdCounter + 1 > _tokenIdCounter, "Token ID overflow");
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _mint(address(this), newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createListing(newTokenId, price);

        emit TokenMinted(newTokenId, msg.sender, tokenURI, price);
        return newTokenId;
    }

    function createListing(uint _tokenId, uint _price) private {
        require(_price > 0, "Price must be greater than 0");
        require(msg.value == listingPrice, "Incorrect listing fee");

        marketListings[_tokenId] = MarketListing(
        _tokenId,
        _price,
        payable(msg.sender),
        payable(address(this)),
        false
        );

        emit MarketListingCreated(_tokenId, _price, msg.sender, address(this), false);
    }

    function cancelListing(uint256 tokenId) public {
        MarketListing storage listing = marketListings[tokenId];

        require(msg.sender == listing.seller, "Only the seller can cancel the listing");
        require(!listing.sold, "Cannot cancel a sold listing");

        if (address(this) == ownerOf(tokenId)) {
            _transfer(address(this), msg.sender, tokenId);
        }

        listing.sold = true;
        listing.seller = payable(address(0));

        emit ListingCancelled(tokenId, msg.sender);
    }

    function purchaseItem(uint256 tokenId) public payable {
        uint price = marketListings[tokenId].price;
        address seller = marketListings[tokenId].seller;
        require(msg.value == price, "Price must be equal to item price");

        marketListings[tokenId].owner = payable(msg.sender);
        marketListings[tokenId].sold = true;
        marketListings[tokenId].seller = payable(address(0));
        _itemSoldCounter++;

        _transfer(address(this), msg.sender, tokenId);
        payable(marketOwner).transfer(listingPrice);
        payable(seller).transfer(msg.value);

        emit ItemPurchased(tokenId, msg.sender, price);
    }

    function getActiveListings() public view returns (MarketListing[] memory) {
        uint totalItemCount = _tokenIdCounter;
        MarketListing[] memory tempUnsoldItems = new MarketListing[](totalItemCount);
        uint unsoldItemCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (marketListings[i + 1].sold == false) {
                tempUnsoldItems[unsoldItemCount] = marketListings[i + 1];
                unsoldItemCount++;
            }
        }

        MarketListing[] memory unsoldItems = new MarketListing[](unsoldItemCount);
        for (uint i = 0; i < unsoldItemCount; i++) {
            unsoldItems[i] = tempUnsoldItems[i];
        }

        return unsoldItems;
    }

    function getMyPurchasedItems() public view returns (MarketListing[] memory) {
        uint totalItemCount = _tokenIdCounter;
        uint itemCount = 0;
        MarketListing[] memory tempItems = new MarketListing[](totalItemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (marketListings[i + 1].sold == true && marketListings[i + 1].owner == msg.sender) {
                tempItems[itemCount] = marketListings[i + 1];
                itemCount++;
            }
        }

        MarketListing[] memory items = new MarketListing[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            items[i] = tempItems[i];
        }

        return items;
    }

    function getMyListedItems() public view returns (MarketListing[] memory) {
        uint totalItemCount = _tokenIdCounter;
        uint itemCount = 0;
        MarketListing[] memory tempItems = new MarketListing[](totalItemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (marketListings[i + 1].sold == false && marketListings[i + 1].seller == msg.sender) {
                tempItems[itemCount] = marketListings[i + 1];
                itemCount++;
            }
        }

        MarketListing[] memory items = new MarketListing[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            items[i] = tempItems[i];
        }

        return items;
    }   

    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function getItemPrice(uint _itemId) view public returns (uint) {
        return marketListings[_itemId].price + listingPrice;
    }
}
