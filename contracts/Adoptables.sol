//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './standards/ERC721/ERC721.sol';
import './standards/IERC165.sol';
import './standards/IERC721Royalties.sol';

contract Adoptables is IERC165, IERC721Royalties, ERC721 {
    // Keep track of the next token ID to use for minting
    uint256 private _tokenIdCounter;

    // Token URI to token Id mapping
    mapping (string => uint256) internal _registeredTokenURIs;

    // Token Id to royalty receiver address 
    mapping (uint256 => address) private _tokenRoyaltyReceiver;

    // Token Id to royalty % 
    mapping (uint256 => uint256) private _tokenRoyalty;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenIdCounter = 1;
    }

    /*
    *  @dev See {IERC165-supportsInterface}.
    */ 
    function supportsInterface(bytes4 interfaceID) public view virtual override (IERC165, ERC721) returns (bool) {
        return (
            interfaceID == type(IERC721Royalties).interfaceId ||
            super.supportsInterface(interfaceID));
    }

    /*
    *  @dev See {IERC721Royalties-royalty}.
    */ 
    function royaltyReceiver(uint256 _tokenId) public view virtual override returns (address) {
        return _tokenRoyaltyReceiver[_tokenId];
    }

    /*
    *  @dev See {IERC721Royalties-royalty}.
    */ 
    function royalty(uint256 _tokenId) public view virtual override returns (uint256) {
        return _tokenRoyalty[_tokenId];
    }

    /*
    * *  Minting (no ERC721 standards here)
    * * *
    * * * *
    * * * * */

    /*
    *  @dev Vends a new Adoptable
    */
    function vend(
        address to, 
        address royaltyAddress,
        uint256 royaltyAmount,
        string memory IPFSAssetHash) public payable {

        require(to != address(0), "Adoptable NFT: Vend attempt to a zero address");
        require(_registeredTokenURIs[IPFSAssetHash] == 0, "Adoptable NFT: IPFSHash is already registered to another token");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _transfer(address(0), to, tokenId);

        _tokenURIs[tokenId] = IPFSAssetHash;

        // Allow quick IPFSHash to token look-ups later to prevent duplicate tokenURIs
        //
        _registeredTokenURIs[IPFSAssetHash] = tokenId;

        // We assume NFT creator == creator and royalties recipient
        //
        _tokenRoyaltyReceiver[tokenId] = royaltyAddress;
        _tokenRoyalty[tokenId] = royaltyAmount;
    }
}
