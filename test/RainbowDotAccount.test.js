const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
const should = chai.use(require('chai-bignumber')(BigNumber)).should()

const RainbowDotAccount = artifacts.require('RainbowDotAccount')
const RainbowDotLeague = artifacts.require('RainbowDotLeague')
const RainbowDot = artifacts.require('RainbowDot')

contract('RainbowDotAccount', function ([deployer, ...members]) {
  context('RainbowDotAccount is deployed by RainbowDot.sol contract',
    async () => {
      let rainbowDot
      let account
      describe('constructor()', async () => {
        it('will be called by the RainbowDot contract and assign that as its primary',
          async () => {
            rainbowDot = await RainbowDot.new(members)
            let accountAddress = await rainbowDot.accounts()
            account = await RainbowDotAccount.at(accountAddress)
            assert.equal(rainbowDot.address, await account.primary())
          })
      })
    })

  context('When the account manager is once deployed successfully', async () => {
    let rainbowDot
    let account
    let rainbowDotLeague
    beforeEach(async () => {
        // Deploy rainbow dot first
        rainbowDot = await RainbowDot.new(members)
        // Get committee which is deployed during the RainbowDot contract's deployment
        let accountAddress = await rainbowDot.accounts()
        account = await RainbowDotAccount.at(accountAddress)
        // Deploy a new league & register it to the rainbow dot
        rainbowDotLeague = await RainbowDotLeague.new(deployer, 'Indexmine Cup')
        await rainbowDotLeague.register(rainbowDot.address, { from: deployer })
      }
    )
    describe('addUser()', async () => {
      //TODO
      it('should add users into the list')
    })
    describe('useRDots()', async () => {
      //TODO
      it('should be called by the primary contract and reduce the rDots from the target account')
    })
    describe('updateScore()', async () => {
      //TODO
      it('should be called by the primary contract and update user\'s score data')
    })
    describe('updateGrade()', async () => {
      //TODO
      it('should be called by the RainbowDot contract and update season number')
    })
    describe('updateGradingStandard()', async () => {
      //TODO
      it('should be called by the committee and set the criteria for grading')
    })
    describe('exist()', async () => {
      //TODO
      it('should return the given address if live or not')
    })
    describe('getAccount()', async () => {
      //TODO
      it('should migrate account manager')
    })
    describe('getAvailableRDots()', async () => {
      //TODO
      it('will submit a new agenda to the committee')
    })
    describe('getGrade()', async () => {
      //TODO
      it('returns account manager')
    })
    describe('getCurrentSeasonScore()', async () => {
      //TODO
      it('should return a given address is an approved league or not')
    })
    describe('getScoreOfSpecificSeason()', async () => {
      //TODO
      it('should return a given address is an approved league or not')
    })
  })
})
