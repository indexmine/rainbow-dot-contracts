const chai = require('chai')
const BigNumber = web3.BigNumber
chai.use(require('chai-bignumber')(BigNumber)).should()

contract('RainbowDotLeague', function ([deployer, ...members]) {
  context('When a league is once deployed successfully', async () => {
    describe('newSeason()', async () => {
      it('should start a new season')
    })
    describe('openForecast()', async () => {
      it('should start a new season')
    })
    describe('sealedForecast()', async () => {
      it('should start a new season')
    })
    describe('revealForecast()', async () => {
      it('should start a new season')
    })
    describe('close()', async () => {
      it('should start a new season')
    })
  })
})
