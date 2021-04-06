const AuctionFactory = artifacts.require("AuctionFactory");
const Adoptables = artifacts.require("Adoptables");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(AuctionFactory);
  deployer.deploy(Adoptables, "Adoptables", "ADP");
};
