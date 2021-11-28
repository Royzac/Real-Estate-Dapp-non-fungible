const realEstateTransaction = artifacts.require("realEstateTransaction.sol");
const utils = require("../helpers/utils");



contract("realEstateTransaction", (accounts) => {
    let [alice, bob] = accounts;
    before(async() => {
        instance = await realEstateTransaction.deployed();
    });

    it('should deploy smart contract properly', async() => {
        assert(instance.address !== '');
    });


    it("should be able to mint a new property", async () => {
        let result = await instance.mintProperty("50 King St.", {from: alice});        
        assert.equal(result.logs[0].args.status,"a new property has has been minted!");
        })

    //     xit("should not allow second user to mint a prexisting property", async () => {
    //         await instance.mintProperty("50 King St.", {from: alice});
    //         await utils.shouldThrow(instance.mintProperty("50 King St.", {from: alice}));

    // })
    context("with the one-step transfer scenario", async () => {
        it("property posted for sale", async () => {
            let result_1 = await instance.listPropertyForSale("50 King St.", 50, {from: alice});
            assert.equal("50 King St.", result_1.logs[0].args._addressName);
            })
        // it("Should indicate that the property has been property purchased", async () => {
        //     let result_2 = await instance.buyProperty(result_1, {from: bob});
        //     state = await result_2.logs[0].args.status;
        //     assert.equal(state,"The property has a new owner!",);
        //     })
    })
})

// it('sells items and transfers eth to seller', async() => {
//     let oldSellerBalance;
//     oldSellerBalance = await web3.eth.getBalance(seller);
//     oldSellerBalance = new web3.utils.BN(oldSellerBalance);
    
//     purchase = await jaslist.buyItem(1, { from: buyer, value: web3.utils.toWei('1', 'Ether') });
    
//     const itemSoldData = purchase.logs[0].args;
//     // console.log(itemSoldData);
//     assert.equal(itemSoldData._name, "test", "name is not correct");
//     assert.equal(itemSoldData._itemOwner, buyer, "item owner is not correct");

//     let newSellerBalance;
//     newSellerBalance = await web3.eth.getBalance(seller);
//     newSellerBalance = new web3.utils.BN(newSellerBalance);

//     let price;
//     price = web3.utils.toWei('1', 'Ether');
//     price = new web3.utils.BN(price);

//     // console.log(oldSellerBalance.toString(), newSellerBalance.toString(), price.toString());

//     const expectedBalance = oldSellerBalance.add(price);
//     assert.equal(newSellerBalance.toString(), expectedBalance.toString());