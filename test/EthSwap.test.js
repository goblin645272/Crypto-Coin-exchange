const { assert } = require('chai');



const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");
require('chai').use(require('chai-as-promised')).should()

function tokens(n){
    return web3.utils.toWei(n, "ether")
}

contract('EthSwap',([deployer, investor])=>{
    let token, ethSwap;
    before(async()=>{
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
    })
    describe('Token Deployment', async()=>{
        it("contract has name", async()=>{
            const name = await token.name()
            assert.equal(name, "DApp Token")
        })
    })
    describe('EthSwap Deployment', async()=>{
        it("contract has name", async()=>{
            const name = await ethSwap.name()
            assert.equal(name, "Taksha's Exchange")
        })
        it("contract has tokens", async()=>{
            await token.transfer(ethSwap.address, tokens("1000000"))
            const balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance, tokens("1000000"))
        })
    })

    describe("buy Tokens", async()=>{
        let result
        before(async()=>{
           result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', "ether")})
        })
        it("Check Investor balance", async()=>{
           assert.equal(await token.balanceOf(investor), tokens("100"))
        })
        it("Check EthSwap balance", async()=>{
            assert.equal(await token.balanceOf(ethSwap.address), tokens("999900"))
         })
         it("Check Eth Swap balance", async()=>{
            assert.equal((await web3.eth.getBalance(ethSwap.address)).toString(), web3.utils.toWei("1","ether"))
         })
         it("check log values",async()=>{
             const event = result.logs[0].args
                assert.equal(event.account, investor)
                assert.equal(event.token, token.address)
                assert.equal(event.amount.toString(), tokens('100'))
             assert.equal(event.rate.toString(), '100')
         })
    })
    describe("Sell Tokens", async()=>{
        let result
        before(async()=>{
            await token.approve(ethSwap.address, tokens("100"), {from: investor})
           result = await ethSwap.sellTokens(tokens("100"), {from: investor})
        })
        it("Check Investor balance", async()=>{
           assert.equal(await token.balanceOf(investor), tokens("0"))
        })
        it("Check EthSwap balance", async()=>{
            assert.equal(await token.balanceOf(ethSwap.address), tokens("1000000"))
         })
         it("Check Eth Swap balance", async()=>{
            assert.equal((await web3.eth.getBalance(ethSwap.address)).toString(), web3.utils.toWei("0","ether"))
         })
         it("check log values",async()=>{
             const event = result.logs[0].args
                assert.equal(event.account, investor)
                assert.equal(event.token, token.address)
                assert.equal(event.amount.toString(), tokens('100'))
             assert.equal(event.rate.toString(), '100')
         })
    })
})