const AuctionFactory = artifacts.require('AuctionFactory');
const Auction = artifacts.require('Auction');

contract('AuctionFactory', accounts => {
    let auction; 
    let auctionFactory;

    const factoryOwnerFeeTaker = accounts[0];
    const auctionOwnerBeneficiary = accounts[1];
    const bidderOne = accounts[2];
    const bidderTwo = accounts[3];

    before(() => 
        AuctionFactory.deployed()
            .then(instance => {
                return instance.create(160683, {from: auctionOwnerBeneficiary})
                    .then(receipt => {
                        return Auction.at(receipt.logs[0].args[0])
                            .then(auctionInstance => {
                                auction = auctionInstance;
                                auctionFactory = instance;
                            });
                    });
            })
    );

    it('should have created one auction instance', () =>
        auctionFactory.auctionsCreated({from: bidderOne})
            .then(result => assert.equal(result, 1))
    );

    it('should reject 0 ETH bid', () =>
        auction.bid({from: bidderOne, value: web3.utils.toWei("0", "ether")})
            .catch(error => {
                assert.equal(error.message, 'Returned error: VM Exception while processing transaction: revert Below the minimum bid amount -- Reason given: Below the minimum bid amount.')
            })
    );
            
    it('should allow bid and reject lower bid', () => 
        auction.bid({from: bidderOne, value: web3.utils.toWei("0.2", "ether")})
            .then(() => auction.bid({from: bidderTwo, value: 
                web3.utils.toWei("0.1", "ether")}))
            .catch(error => 
                assert.equal(error.message, 'Returned error: VM Exception while processing transaction: revert Bid amount too low to beat the current bidder -- Reason given: Bid amount too low to beat the current bidder.')
            )
    );

    it('should allow bid withdrawal', () => {
        return web3.eth.getBalance(bidderOne)
            .then(initialBalance => {
                return auction.withdraw({from: bidderOne})
                .then(receipt => {
                    return web3.eth.getBalance(bidderOne)
                    .then(balance => {
                        return web3.eth.getTransaction(receipt.tx)
                        .then(tx => {
                            let finalBalance = new web3.utils.BN((balance-initialBalance).toString());
                            let eth = web3.utils.fromWei(finalBalance, "ether");
                            
                            assert.equal((Math.round(eth * 100)/100), 0.2);
                        });
                    })
                });
            });
    });

    it('should allow new high bid', () =>
        auction.bid({from: bidderTwo, value: web3.utils.toWei("2", "ether")})
            .then(receipt => assert.notEqual(receipt, 0))
    );

    it('should get my bid amount', () =>
        auction.myBid({from: bidderTwo})
            .then(result => assert.equal(web3.utils.fromWei(result, "ether"), 2))
    );

    it('should reject bid if auction ended', () => 
        new Promise(resolve => setTimeout(resolve, 11000))
            .then(() => auction.bid({from: bidderOne, 
                value: web3.utils.toWei("3", "ether")}))
            .catch(error => 
                assert.equal(error.message, 'Returned error: VM Exception while processing transaction: revert Auction already ended -- Reason given: Auction already ended.')
            )
    );

    it('should allow auction settlement with a 10% fee going to contract owner', () => {
        return web3.eth.getBalance(factoryOwnerFeeTaker)
            .then(initialBalance => {
                return auction.settle({from: factoryOwnerFeeTaker})
                    .then(receipt => {
                        return web3.eth.getBalance(factoryOwnerFeeTaker)
                        .then(balance => {
                            return web3.eth.getTransaction(receipt.tx)
                            .then(tx => {
                                let finalBalance = new web3.utils.BN((balance-initialBalance).toString());
                                let eth = web3.utils.fromWei(finalBalance, "ether");
                                
                                assert.equal((Math.round(eth * 100)/100), 0.2);
                            });
                        })
                    });
            });
    });
});