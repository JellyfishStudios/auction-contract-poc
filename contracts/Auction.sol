//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

contract Auction {
    uint prize;
    uint auctionCreated;
    uint auctionEnds;
    bool auctionSettled;
    bool auctionWon;
    uint minimumBid;
    uint fee;

    struct Bid {
        address bidder;
        uint bid;
    }

    address payable beneficiary;
    address payable feeTaker;
    address owner;
    address highestBidder;
    address previousHighestBidder;

    event BidWithdrawn (address indexed _from, uint bid);
    event NewBid (address indexed _from, uint bid);
    event AuctionStarted (uint _timestamp, address indexed _owner);
    event AuctionEnded (uint _timestamp, address indexed _winner, uint _winningBid, bool auctionWon);

    mapping(address => Bid) bidLedger;

    function initialise(
        address payable _beneficiary, 
        address payable _feeTaker,
        uint _prize, 
        uint _minimumBid,
        uint _feePercentage, 
        uint _auctionTimeLimit) public {

        owner = msg.sender;
        beneficiary = _beneficiary; 
        feeTaker = _feeTaker; 

        fee = _feePercentage;
        prize = _prize;

        auctionCreated = block.timestamp;
        auctionEnds = auctionCreated + _auctionTimeLimit;
        auctionSettled = false;
        minimumBid = _minimumBid;

        emit AuctionStarted(auctionCreated, owner);
    }

    function claimPrize() public view returns (uint) {
        require (
            block.timestamp >= auctionEnds,
            "Auction not yet ended");

        require (
            msg.sender == highestBidder,
            "You did not win the auction");

        return prize;
    }

    function settle() public {
        require (
            auctionSettled == false,
            "Auction already settled");

        require (
            block.timestamp >= auctionEnds,
            "Auction not yet ended");

        auctionSettled = true;

        // Warning: What if this fails?
        //
        if (highestBidder != address(0) && bidLedger[highestBidder].bid > 0) {
            auctionWon = true;

            beneficiary.transfer((bidLedger[highestBidder].bid * (10000-fee)) / 10000);
            feeTaker.transfer((bidLedger[highestBidder].bid * fee) / 10000);
        }

        emit AuctionEnded(auctionEnds, highestBidder, bidLedger[highestBidder].bid, auctionWon);
    }

    function bid() public payable {
        require (
            block.timestamp < auctionEnds,
            "Auction already ended");

        require (
            msg.sender != highestBidder,
            "You are already the highest bidder");

        require (
            bidLedger[msg.sender].bid == 0,
            "Please withdraw your previous bid before trying to big again");

        require (
            msg.value > 0 && msg.value >= minimumBid,
            "Below the minimum bid amount");

        require (
            msg.value > bidLedger[highestBidder].bid,
            "Bid amount too low to beat the current bidder");

        // Successful bidder in town
        //
        bidLedger[msg.sender] = Bid(msg.sender, msg.value);
        previousHighestBidder = highestBidder;
        highestBidder = msg.sender;

        emit NewBid(msg.sender, msg.value);
    }

    function myBid() public view returns(uint) {
        return bidLedger[msg.sender].bid;
    }

    function withdraw() public {
        require(
            bidLedger[msg.sender].bid > 0,
            "You have no open bid");

        // Remove their bid so they can't withdraw from the contract again
        // before the actual transfer takes place
        //
        uint amount = bidLedger[msg.sender].bid;
        bidLedger[msg.sender].bid = 0;

        // Refund
        //
        payable(msg.sender).transfer(amount);

        if (highestBidder == msg.sender)
            highestBidder = address(0);

        // Warning: Will break if the previous bidder already withdrew their bid
        //
        if (previousHighestBidder != address(0))
            highestBidder = previousHighestBidder;

        emit BidWithdrawn(msg.sender, bidLedger[highestBidder].bid);
    }
}