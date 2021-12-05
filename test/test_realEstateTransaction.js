const realEstateTransaction = artifacts.require("realEstateTransaction.sol");
const { assert } = require("chai");



contract("realEstateTransaction", (accounts) => {
    const [seller, buyer] = accounts;
        
        let instance;

        before(async() => {
            instance = await realEstateTransaction.deployed();
        });

        it('should deploy smart contract properly', async() => {
        assert(instance.address !== '');
        });


        it("should be able to mint a new property", async () => {
            let result = await instance.mintProperty("50 King St.", {from: seller});        
            assert.equal(result.logs[0].args.status,"a new property has has been minted!");
            })

    //     xit("should not allow second user to mint a prexisting property", async () => {
    //         await instance.mintProperty("50 King St.", {from: alice});
    //         await utils.shouldThrow(instance.mintProperty("50 King St.", {from: alice}));

    // })
    context("with the one-step transfer scenario", async () => {
        let listedProperty;
        before(async() => {
            listedProperty = await instance.listPropertyForSale("50 King St.", web3.utils.toWei('1', 'Ether'), { from: seller });   
        });
        it("should verify property is posted for sale", async () => {
            assert.equal("50 King St.", listedProperty.logs[0].args._addressName);
            })
        it("should verify property is purchased", async () => {
            let purchase = await instance.buyProperty("50 King St.", { from: buyer, value: web3.utils.toWei('2', 'Ether') });
            assert.equal("50 King St.", purchase.logs[0].args.addressName);
                })
        
        it("should verify seller received money", async () => {
            let sellerBalance = await web3.eth.getBalance(seller);
            sellerBalance = new web3.utils.BN(sellerBalance)
            let eth_amount = web3.utils.fromWei(sellerBalance.toString(), 'Ether')
            expect(parseInt(eth_amount)).to.be.greaterThan(100)

        })
    })
})
