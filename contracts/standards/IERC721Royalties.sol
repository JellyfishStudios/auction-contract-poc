
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './IERC165.sol';

interface IERC721Royalties is IERC165 {
    /**
     * @notice Called to return both the creator's address
     */
    function royaltyReceiver(uint256 _tokenId) external returns (address);

    /**
     * @notice Returns a percentage calculated as a fixed point with a scaling factor of 100000,
     *         such that 100% would be the value 10000000, as 10000000/100000 = 100.
     *         1% would be the value 100000, as 100000/100000 = 1
     */
    function royalty(uint256 _tokenId) external returns (uint256);
}