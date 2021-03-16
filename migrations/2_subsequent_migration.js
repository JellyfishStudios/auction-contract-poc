const AuctionFactory = artifacts.require("AuctionFactory");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(AuctionFactory);
};
