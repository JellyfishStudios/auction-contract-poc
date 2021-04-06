//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './Auction.sol';
import './Utils/ProxyFactory.sol';

contract AuctionFactory is ProxyFactory {
    uint minimumBid;
    uint feePercentage;
    uint timeLimit;

    Auction[] deployedAuctions;

    event AuctionCreated(address newAddress);

    address owner;
    address masterContract;

    constructor() {
        minimumBid = 0;
        feePercentage = 1000;
        timeLimit = 10;

        owner = msg.sender;

        masterContract = address(new Auction());
    }

    function create(uint _prize) public {
        Auction auction = Auction(createProxy(masterContract));
        auction.initialise(
            payable(msg.sender),
            payable(owner),
            _prize,
            minimumBid,
            feePercentage,
            timeLimit);

        deployedAuctions.push(auction);

        emit AuctionCreated(address(auction));
    }

    function auctionsCreated() public view returns(uint) {
        return deployedAuctions.length;
    }
}