const chai = require('chai')
const BigNumber = web3.BigNumber
chai.use(require('chai-bignumber')(BigNumber)).should()

contract('RainbowDotMarket', ([deployer, ...members]) => {
  context('Accounts can register as a seller by staking IPT', async () => {
  })
  context('Buyer can ask to buy sealed forecast after registration of their public keys', async () => {
    it('should emit Events to notify to the sellers')
  })
  context('Challenge system works with oracle service before the on-chain RSA encryption solution created', async () => {
    it('should configure its challenge fee')
    it('should be able to change the oracle provider')
    it('should deposit a challenge fee')
    it('should slash and give the seller\'s stake to the challenger when the oracle provider judged the transaction a fraud')
    it('should give commission fee to the oracle provider')
  })
})
