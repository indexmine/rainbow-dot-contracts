const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
const should = chai.use(require('chai-bignumber')(BigNumber)).should()

const RainbowDotAccount = artifacts.require('RainbowDotAccount')
const RainbowDotCommittee = artifacts.require('RainbowDotCommittee')
const RainbowDotLeague = artifacts.require('RainbowDotLeague')
const WeeklyLeague = artifacts.require('WeeklyLeague')
const RainbowDot = artifacts.require('RainbowDot')

contract('RainbowDot', function ([deployer, oracle, user, ...members]) {
  context('RainbowDot is deployed by an EOA',
    async () => {
      let rainbowDot
      describe('constructor()', async () => {
        it('will be called by the RainbowDot contract and assign that as its primary',
          async () => {
            rainbowDot = await RainbowDot.new(members)
          })
      })
    })

  context('When a committee is once deployed successfully', async () => {
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
    describe('join()', async () => {
      it('should add users into the list', async () => {
        // Get account manager
        let accountMangerAddr = await rainbowDot.getAccounts()
        let accountManager = await RainbowDotAccount.at(accountMangerAddr)
        let exist
        // Check that account does not exist
        exist = await accountManager.exist(user)
        exist.should.equal(false)
        // Join
        await rainbowDot.join({ from: user })
        // Check that account exists
        exist = await accountManager.exist(user)
        exist.should.equal(true)
      })
      it('should register only once', async () => {
        await rainbowDot.join({ from: user })
        try {
          await rainbowDot.join({ from: user })
          assert(false)
        } catch (e) {
          e.message.includes('revert').should.equal(true)
        }
      })
    })
    describe('requestLeagueRegistration()', async () => {
      it('should submit a new league registration request to the committee', async () => {
        let league = await RainbowDotLeague.new(oracle, 'Test league')
        let result = await rainbowDot.requestLeagueRegistration(league.address, 'This is a test request for approval')
        let agendaId
        // Find event log from receipt
        for (let log of result.receipt.logs) {
          if (log.topics[0] === web3.sha3('NewAgenda(uint256)')) {
            agendaId = web3.toBigNumber(log.data)
          }
        }
        // Get agenda from committee. If it does not exist, this line will be reverted
        let agenda = await committee.getAgenda(agendaId)
        // Get address to vote to register as a league
        let target = agenda[1]
        // It should be equal with the above address of league what we created here
        target.should.equal(league.address)
      })
      it('should be automatically called by RainbowDotLeague\'s register() method', async () => {
        let league = await RainbowDotLeague.new(oracle, 'Test league')
        let result = await league.register(rainbowDot.address)
        // Find event log from receipt
        for (let log of result.receipt.logs) {
          if (log.topics[0] === web3.sha3('NewAgenda(uint256)')) {
            agendaId = web3.toBigNumber(log.data)
          }
        }
        // Get agenda from committee. If it does not exist, this line will be reverted
        let agenda = await committee.getAgenda(agendaId)
        // Get address to vote to register as a league
        let target = agenda[1]
        // It should be equal with the above address of league what we created here
        target.should.equal(league.address)
      })
    })

    describe('migrateAccountManager()', async () => {
      it('should migrate account manager', async () => {
        // Get original account manager
        let accountMangerAddr = await rainbowDot.getAccounts()
        let newAccountManager = await RainbowDotAccount.new()
        let result = await rainbowDot.migrateAccountManager(newAccountManager.address, 'Agendas')
        // Account manager address should not be changed yet
        accountMangerAddr.should.equal(await rainbowDot.getAccounts())
        // Get agenda
        let agendaId
        for (let log of result.receipt.logs) {
          if (log.topics[0] === web3.sha3('NewAgenda(uint256)')) {
            console.log(web3.toUtf8(log.data[1]))
          }
        }
      })
    })

    describe.only('newMinterLeague()', async () => {
      it('will submit a new agenda to the committee', async () => {
        let weeklyLeague = await WeeklyLeague.new(oracle, 'Weekly')
        let result = await rainbowDot.newMinterLeague(weeklyLeague.address, 'Weekly league')
        // Find event log from receipt
        for (let log of result.receipt.logs) {
          if (log.topics[0] === web3.sha3('NewAgenda(uint256)')) {
            agendaId = web3.toBigNumber(log.data)
          }
        }
        // Get agenda from committee. If it does not exist, this line will be reverted
        let agenda = await committee.getAgenda(agendaId)
        // Get address to vote to register as a league
        let target = agenda[1]
        // It should be equal with the above address of league what we created here
        target.should.equal(weeklyLeague.address)
      })
    })

    describe('getAccounts()', async () => {
      it('returns account manager')
    })
    describe('isApprovedLeague()', async () => {
      it('should return a given address is an approved league or not')
    })
  })
})
