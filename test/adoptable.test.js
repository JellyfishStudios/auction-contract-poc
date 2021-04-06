const { SettingsApplicationsOutlined } = require("@material-ui/icons");
const { assert } = require("chai");

const Adoptables = artifacts.require("Adoptables");

contract('Adoptables', accounts => {

    const owner1 = accounts[1];
    const owner2 = accounts[2];
    
    let adoptables;

    before(() => 
        Adoptables.deployed()
                .then(instance => adoptables = instance)
    );

    it('should hold symbol', () => 
        adoptables.symbol()
            .then(result => assert.equal(result, 'ADP'))
    );

    it('should vend a token to owner 1', () =>
        adoptables.vend(owner1, "https://google.com", {from: owner1})
            .then(receipt => {
                let token = new web3.utils.BN(receipt.logs[0].args[2]).toString();
                assert.equal(token, 1);
            })
    );

    it('should vend another new token to owner 1', () =>
        adoptables.vend(owner1, "https://www.msn.com", {from: owner1})
            .then(receipt => {
                let token = new web3.utils.BN(receipt.logs[0].args[2]).toString();
                assert.equal(token, 2);
            })
    );

    it('should vend a token to owner 2', () =>
        adoptables.vend(owner2, "https://yahoo.com", {from: owner2})
            .then(receipt => {
                let token = new web3.utils.BN(receipt.logs[0].args[2]).toString();
                assert.equal(token, 3);
            })
    );

    it('should not allow new vend for existing tokenURI', () =>
        adoptables.vend(owner2, "https://yahoo.com", {from: owner2})
            .catch(error => 
                assert.equal(error.message, "Returned error: VM Exception while processing transaction: revert Adoptable NFT: IPFSHash is already registered to another token -- Reason given: Adoptable NFT: IPFSHash is already registered to another token."))
    );

    it('should return tokenURI', () => 
        adoptables.tokenURI(2)
            .then(result => assert.equal(result, "https://www.msn.com"))
    );

    it('should return correct balance', () => 
        adoptables.balanceOf(owner1)
            .then(result => assert.equal(result, 2))
    );
})