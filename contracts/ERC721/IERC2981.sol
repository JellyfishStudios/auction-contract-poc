
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './IERC165.sol';

interface IERC2981 is IERC165 {
    /**
     *      @notice Called to return both the creator's address and the royalty percentage -
     *              this would be the main function called by marketplaces unless they specifically
     *              need to adjust the royaltyAmount
     *      @notice Percentage is calculated as a fixed point with a scaling factor of 100000,
     *              such that 100% would be the value 10000000, as 10000000/100000 = 100.
     *              1% would be the value 100000, as 100000/100000 = 1
     */
    function royaltyInfo(uint256 _tokenId) external returns (address receiver, uint256 amount);

    /**
     *      @notice Called when royalty is transferred to the receiver. We wrap emitting
     *              the event as we want the NFT contract itself to contain the event.
     */
    function receivedRoyalties(address _royaltyRecipient, address _buyer, uint256 _tokenId, address _tokenPaid, uint256 _amount) external;
}