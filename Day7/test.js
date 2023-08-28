const LendableSBT = artifacts.require("LendableSBT");
const { assert } = require('chai');

contract('LendableSBT', (accounts) => {
    let contract;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    let tokenId;

    before(async () => {
        contract = await LendableSBT.new("Lendable SBT", "LSBT", true, { from: owner });
    });

    describe('Minting Tokens', () => {
        it('should mint a new token', async () => {
            tokenId = await contract.mint(user1, { from: owner });
            assert.exists(tokenId);
        });
    });

    describe('Set Rental Data', () => {
        it('should set rental data for a token', async () => {
            await contract.setRentalData(user1, tokenId, Date.now() + 100000, 1000, { from: owner });
            const rentalData = await contract.getRentalData(user1, tokenId);
            assert.equal(rentalData.expire, Date.now() + 100000);
            assert.equal(rentalData.isRented, false);
            assert.equal(rentalData.rewardAmount, 1000);
        });
    });

    describe('Renting Tokens', () => {
        it('should not allow renting an already rented token', async () => {
            await contract.rent(tokenId, { from: user1 });
            try {
                await contract.rent(tokenId, { from: user1 });
                assert.fail("Expected revert not received");
            } catch (error) {
                assert.exists(error);
            }
        });

        it('should allow renting an available token', async () => {
            await contract.setRentalData(user2, tokenId, Date.now() + 100000, 1000, { from: owner });
            await contract.rent(tokenId, { from: user2 });
            const rentalData = await contract.getRentalData(user2, tokenId);
            assert.equal(rentalData.isRented, true);
        });
    });

    // Add more test cases as needed
    //npm install -g truffle
    //npm install chai @truffle/contract
    //truffle test

});