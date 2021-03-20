//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './interfaces/IERC721.sol';
import './interfaces/IERC721Metadata.sol';
import './interfaces/IERC721Enumerable.sol';

abstract contract ERC721 is IERC721, IERC721Metadata, IERC721Enumerable {

}