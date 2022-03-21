// const { assert } = require("console");

const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");

    // Create star.
    await instance.createStar('awesome star', starId, {from: user1});
    // Put created star up for sale.
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    // Balance of user1 before transaction.
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);

    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".06", "ether");

    //User1 creates star and puts it up for sale.
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    //Retrieve balance of buyer (user2) before purchase
    // let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);

    //User2 buys star
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});

    //Retrive balance of buyer(user2) after purchase
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);

    // Subtract balance of buyer after purchase from balance before purchase to get the starPrice
    let value = (Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar)) ;
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    
    // Create contract instance
    let instance = await StarNotary.deployed();
    
    // 1. create a Star with different tokenId
    let starName = 'StarNotaryToken';
    let symbol = 'SNT';


    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    assert.equal(await instance.name_.call(),starName)
    assert.equal(await instance.symbol_.call(),symbol)
    
});

it('lets 2 users exchange stars', async() => {
    //create instance of contract
    let instance = await StarNotary.deployed();

    let alice={
        tokenName:'crescent',
        tokenId:12,
        address:accounts[3]
    }

    let bob = {
        tokenName:'tulips',
        tokenId:13,
        address: accounts[4]
    }

    // 1. create 2 Stars with different tokenId
    await instance.createStar(alice.tokenName,alice.tokenId,{from:alice.address});
    await instance.createStar(bob.tokenName,bob.tokenId,{from:bob.address});

    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(12,13,{from:alice.address});

    // Retrieve new token owners
    let newOwnerOfCrescentToken = await instance.ownerOf.call(alice.tokenId)
    let newOwnerOfTulipsToken = await instance.ownerOf.call(bob.tokenId)

    // 3. Verify that the owners changed
    assert.equal(newOwnerOfCrescentToken,bob.address);
    // assert.equal(newOwnerOfTulipsToken,alice.address);
});

it('lets a user transfer a star', async() => {
    //create instance of contract
    let instance = await StarNotary.deployed();

    let alice={
        tokenName:'crescent',
        tokenId:20,
        address:owner
    }

    let bob=accounts[1]
    
    // 1. create a Star with different tokenId
    await instance.createStar(alice.tokenName,alice.tokenId,{from:alice.address});

    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(bob,alice.tokenId,{from:alice.address});

    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf(alice.tokenId),bob);
});

it('lookUptokenIdToStarInfo test', async() => {
        //create instance of contract
        let instance = await StarNotary.deployed();

        let alice={
            tokenName:'crescent',
            tokenId:16,
            address:owner
        }
        
        // 1. create a Star with different tokenId
        await instance.createStar(alice.tokenName,alice.tokenId,{from:alice.address});
    
    // 2. Call your method lookUptokenIdToStarInfo
        let tokenName = await instance.lookUptokenIdToStarInfo(alice.tokenId);

    // 3. Verify if you Star name is the same
        assert.equal(tokenName,alice.tokenName);
});