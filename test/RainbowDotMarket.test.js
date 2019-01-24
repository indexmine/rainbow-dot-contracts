const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
const should = chai.use(require('chai-bignumber')(BigNumber)).should()

const RainbowDotCommittee = artifacts.require('RainbowDotCommittee')
const RainbowDotLeague = artifacts.require('RainbowDotLeague')
const RainbowDotMarket = artifacts.require('RainbowDotMarket')
const RainbowDot = artifacts.require('RainbowDot')

contract('RainbowDotMarket', ([deployer, ...members]) => {
  context('Accounts can register as a seller by staking IPT', async () => {
  })
  context('Buyer can ask to buy sealed forecast after registration of their public keys', async () => {
    it('should emit Events to notify to the sellers', async () => {
    })
  })
  context('Challenge system works with oracle service before the on-chain RSA encryption solution created', async () => {
    it('should configure its challenge fee', async () => {})
    it('should be able to change the oracle provider', async () => {})
    it('should deposit a challenge fee', async () => {})
    it('should slash and give the seller\'s stake to the challenger when the oracle provider judged the transaction a fraud', async () => {})
    it('should give commission fee to the oracle provider', async () => {})
  })
})
