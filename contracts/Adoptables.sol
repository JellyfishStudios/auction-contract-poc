//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './ERC721/ERC721.sol';

contract Adoptables is ERC721 {
    // Keep track of the next token ID to use for minting
    uint256 private _tokenIdCounter;

    // Token URI to token Id mapping
    mapping (string => uint256) internal _registeredTokenURIs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenIdCounter = 1;
    }

    /*
    * *  Minting (no ERC721 standards here)
    * * *
    * * * *
    * * * * */

    /*
    *  @dev Vends a new Adoptable
    */
    function vend(address to, string memory IPFSAssetHash) public payable {
        require(to != address(0), "Adoptable NFT: Vend attempt to a zero address");
        require(_registeredTokenURIs[IPFSAssetHash] == 0, "Adoptable NFT: IPFSHash is already registered to another token");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(to, tokenId);
        _tokenURIs[tokenId] = IPFSAssetHash;
        _registeredTokenURIs[IPFSAssetHash] = tokenId;
    }
}
