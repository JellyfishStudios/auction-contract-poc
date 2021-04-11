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
        adoptables.vend(owner1, owner1, 2000, "https://google.com", {from: owner1})
            .then(receipt => {
                let token = new web3.utils.BN(receipt.logs[0].args[2]).toString();
                assert.equal(token, 1);
            })
    );

    it('should vend another new token to owner 1', () =>
        adoptables.vend(owner1, owner1, 2000, "https://www.msn.com", {from: owner1})
            .then(receipt => {
                let token = new web3.utils.BN(receipt.logs[0].args[2]).toString();
                assert.equal(token, 2);
            })
    );

    it('should vend a token to owner 2', () =>
        adoptables.vend(owner2, owner2, 2000, "https://yahoo.com", {from: owner2})
            .then(receipt => {
                let token = new web3.utils.BN(receipt.logs[0].args[2]).toString();
                assert.equal(token, 3);
            })
    );

    it('should not allow new vend for existing tokenURI', () =>
        adoptables.vend(owner2, owner2, 2000, "https://yahoo.com", {from: owner2})
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

    it('should return royaly receiver address', () => 
        adoptables.royaltyReceiver(1)
            .then(result => assert.equal(result, owner1))
    );

    it('should return creators royalty %', () => 
        adoptables.royalty(1)
            .then(result => assert.equal(result, 2000))
    );

    it('should safe transfer token from owner1 to owner2', () => {
        return adoptables.transferFrom(owner1, owner2, 1, {from: owner1})
            .then(() => {
                return adoptables.balanceOf(owner1)
                    .then(accountBalanceOwner1 => {
                        return adoptables.balanceOf(owner2)
                            .then(accountBalanceOwner2 => {
                                assert.equal(accountBalanceOwner1, 1);
                                assert.equal(accountBalanceOwner2, 2);
                            });
                    });
                   
            });
    });

    it('should return total supply', () => 
        adoptables.totalSupply()
            .then(result => assert.equal(result, 3))
    );

    it('should return token at index', () => 
        adoptables.tokenByIndex(0)
            .then(result => assert.equal(result, 1))
    );

    it('should return all tokens for owner', () => {
        return adoptables.balanceOf(owner2)
            .then(balance => {
                let expected = [new web3.utils.BN(3), new web3.utils.BN(1)];
                let promises = [];

                for (i=0; i<balance; i++)
                    promises.push(adoptables.tokenOfOwnerByIndex(owner2, i))
                
                return Promise.all(promises).then(result => expect(result).to.deep.equal(expected));
            });
    });
})