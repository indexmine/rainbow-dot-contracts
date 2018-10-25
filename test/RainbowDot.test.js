const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
const should = chai.use(require('chai-bignumber')(BigNumber)).should()
const Web3latest = require('web3')
const web3latest = new Web3latest()

const RainbowDotCommittee = artifacts.require('RainbowDotCommittee')
const RainbowDotLeague = artifacts.require('RainbowDotLeague')
const RainbowDot = artifacts.require('RainbowDot')

contract('RainbowDotCommittee', function ([deployer, ...members]) {
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
    describe('submitAgenda()', async () => {
      it('should be called only by the RainbowDot contract', async () => {
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda')
      })
      it('should emit an event to notify a new agenda has been submitted and increment the agenda', async () => {
        let agendaId = -1
        committee.NewAgenda().watch((err, result) => {
          if (err) assert.fail()
          else {
            assert.equal(result.event, 'NewAgenda')
            assert.equal(agendaId + 1, result.args.agendaId.toNumber())
            agendaId = result.args.agendaId.toNumber()
          }
        })
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 1')
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 2')
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 3')
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 4')
      })
    })
    describe('nominate()', async () => {
      //TODO
      it('should be called only by the committee members')
      it('should emit an event to notify a new nomination has been submitted')
    })
    describe('vote()', async () => {
      it('should be called only by the committee members', async () => {
        // Submit agenda
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda')
        // Do something when the agenda has been submitted
        await committee.NewAgenda().watch(async (err, result) => {
          if (err) assert.fail()
          let agendaId = result.args.agendaId.toNumber()
          await committee.vote(agendaId, true, { from: members[0] })
          try {
            await committee.vote(agendaId, true, { from: deployer })
            assert.fail('Should revert')
          } catch (e) {
            assert.ok('Reverted successfully')
          }
        })
      })
      it('should be registered as an approved league at the RainbowDot when vote result is true', async () => {
        // Submit agenda
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda')
        // Do something when the agenda has been submitted
        committee.NewAgenda().watch(async (err, result) => {
          // Vote 5 times
          let agendaId = result.args.agendaId.toNumber()
          await committee.vote(agendaId, true, { from: members[0] })
          await committee.vote(agendaId, true, { from: members[1] })
          await committee.vote(agendaId, true, { from: members[2] })
          await committee.vote(agendaId, true, { from: members[3] })
          await committee.vote(agendaId, true, { from: members[4] })
        })
        committee.OnResult().watch(async (err, result) => {
          if (err) assert.fail()
          assert.equal(result.args.result, true)
          assert.equal(await rainbowDot.isApprovedLeague(rainbowDotLeague.address), true)
        })
      })
    })
    describe('voteForNomination()', async () => {
      //TODO
      it('should be called only by the committee members')
      it('should emit an event to notify a new nomination has been submitted')
    })
  })
})
