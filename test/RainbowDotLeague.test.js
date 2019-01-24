const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
const should = chai.use(require('chai-bignumber')(BigNumber)).should()

const RainbowDotCommittee = artifacts.require('RainbowDotCommittee')
const RainbowDotLeague = artifacts.require('RainbowDotLeague')
const RainbowDot = artifacts.require('RainbowDot')

contract('RainbowDotLeague', function ([deployer, ...members]) {
  context('RainbowDotComittee is deployed by the RainbowDot.sol contract',
    async () => {
      let committee
      describe('constructor()', async () => {
        it('will be called by the RainbowDot contract and assign that as its primary',
          async () => {
            let rainbowDot = await RainbowDot.new(members)
            let commiteeAddress = await rainbowDot.committee()
            committee = await RainbowDotCommittee.at(commiteeAddress)
            assert.equal(rainbowDot.address, await committee.primary())
          })
      })
    })

  context('When a league is once deployed successfully', async () => {
    let rainbowDot
    let committee
    let rainbowDotLeague
    beforeEach(async () => {
        // Deploy rainbow dot first
        rainbowDot = await RainbowDot.new(members)
        // Get committee which is deployed during the RainbowDot contract's deployment
        let commiteeAddress = await rainbowDot.committee()
        committee = await RainbowDotCommittee.at(commiteeAddress)
        // Deploy a new league & register it to the rainbow dot
        rainbowDotLeague = await RainbowDotLeague.new(deployer, 'Indexmine Cup')
        await rainbowDotLeague.register(rainbowDot.address, { from: deployer })
      }
    )
    describe('newSeason()', async () => {
      it('should start a new season', async () => {
      })
    })
    describe('openForecast()', async () => {
      it('should start a new season', async () => {
      })
    })
    describe('sealedForecast()', async () => {
      it('should start a new season', async () => {
      })
    })
    describe('revealForecast()', async () => {
      it('should start a new season', async () => {
      })
    })
    describe('close()', async () => {
      it('should start a new season', async () => {
      })
    })
  })
})
