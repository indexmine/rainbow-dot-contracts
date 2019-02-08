const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
chai.use(require('chai-bignumber')(BigNumber)).should()

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
      it('should emit an event to notify a new agenda has been submitted and increment the agenda', async () => {
        let agendaId = 0
        let eventFilter = committee.NewAgenda()
        await eventFilter.on('data', result => {
          console.log(result)
          assert.equal(result.event, 'NewAgenda')
          assert.equal(agendaId, result.args.agendaId.toNumber())
          agendaId++
        })
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 1')
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 2')
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 3')
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda 4')
      })
    })
    describe('vote()', async () => {
      it('should be called only by the committee members', async () => {
        // Submit agenda
        await rainbowDot.requestLeagueRegistration(rainbowDotLeague.address, 'test agenda')
        // Do something when the agenda has been submitted
        let eventFilter = committee.NewAgenda()
        await eventFilter.on('data', async (result) => {
          console.log(result)
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
        // Do something when the agenda .toPrecision()has been submitted
        let newAgendas = committee.NewAgenda()
        await newAgendas.on('data', async (result) => {
          console.log(result)
          // Vote 5 times
          let agendaId = result.args.agendaId.toNumber()
          await committee.vote(agendaId, true, { from: members[0] })
          await committee.vote(agendaId, true, { from: members[1] })
          await committee.vote(agendaId, true, { from: members[2] })
          await committee.vote(agendaId, true, { from: members[3] })
          await committee.vote(agendaId, true, { from: members[4] })
        })
        let onResults = committee.OnResult()
        await onResults.on('data', async (result) => {
          console.log(result)
          assert.equal(result.args.result, true)
          assert.equal(await rainbowDot.isApprovedLeague(rainbowDotLeague.address), true)
        })
      })
    })
    describe('nominate()', async () => {
      // TODO
      it('should be called only by the committee members')
      it('should emit an event to notify a new nomination has been submitted')
    })
    describe('voteForNomination()', async () => {
      // TODO
      it('should be called only by the committee members')
      it('should emit an event to notify a new nomination has been submitted')
    })
  })
})
