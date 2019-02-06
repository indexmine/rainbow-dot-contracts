const chai = require('chai')
const BigNumber = web3.BigNumber
chai.use(require('chai-bignumber')(BigNumber)).should()

const RainbowDotCommittee = artifacts.require('RainbowDotCommittee')
const RainbowDotLeague = artifacts.require('RainbowDotLeague')
const RainbowDot = artifacts.require('RainbowDot')
const RainbowDotAccount = artifacts.require('RainbowDotAccount')

contract('RainbowDotLeague', function ([deployer, oracle, user, ...members]) {
  context('When a league is once deployed successfully', async () => {
    let rainbowDot
    let committee
    let rainbowDotLeague
    let rainbowDotAccount
    let currentTime = Math.floor(Date.now() / 1000)
    let code = 1
    let seasonName = 'testSeason'
    let agendaId

    before(async () => {
      // Deploy rainbow dot first
      rainbowDot = await RainbowDot.new(members)

      // Get committee which is deployed during the RainbowDot contract's deployment
      let commiteeAddress = await rainbowDot.committee()
      committee = await RainbowDotCommittee.at(commiteeAddress)

      // Get accounts which is deployed during the RainbowDot contract's deployment
      let accountManagerAddress = await rainbowDot.accounts()
      rainbowDotAccount = await RainbowDotAccount.at(accountManagerAddress)

      // Deploy a new league & register it to the rainbow dot
      rainbowDotLeague = await RainbowDotLeague.new(deployer, 'Indexmine Cup')
      await rainbowDotLeague.register(rainbowDot.address, { from: deployer })

      // add user
      await rainbowDot.join({ from: user })

      let eventFilter = committee.NewAgenda()

      await eventFilter.on('data', async (result) => {
        agendaId = result.args.agendaId.toNumber() // undefined

        // this won't work because of truffle 5's changing
        for (let i = 0; i < members.length; i++) {
          await committee.vote(agendaId, true, { from: members[i] })
        }
      })

      await rainbowDotLeague.newSeason(seasonName, code, currentTime + 10, currentTime + 30000, 10, 2, { from: deployer })
      let isOpened = rainbowDotLeague.SeasonOpened()

      await isOpened.on('data', result => {
        assert.equal(result.args.name, seasonName)
      })
    })
    describe('openedForecast()', async () => {
      it('waiting for season start ...', function (done) {
        setTimeout(function () {
          console.log('waiting over')
          done()
        }, 12000)
      })

      it('should register opened forecast', async () => {
        let onResult = committee.OnResult()
        await onResult.on('data', async (result) => {
          assert.equal(result.args.result, true)
          assert.equal(await rainbowDot.isApprovedLeague(rainbowDotLeague.address), true)
        })

        console.log('agenda id : ', agendaId)

        for (let i = 0; i < members.length; i++) {
          await committee.vote(0, true, { from: members[i] })
        }

        let isApproved = await rainbowDot.isApprovedLeague(rainbowDotLeague.address)

        console.log('isApproved? : ', isApproved)

        console.log('user : ', user)
        let userInfo = await rainbowDotAccount.getAccount(user)
        console.log('user rDot : ', userInfo.rDots.toNumber())
        await rainbowDotLeague.openedForecast(seasonName, 1, 100, 35000, { from: user })
      })
    })
    describe('sealedForecast()', async () => {
      it('should register sealed forecast', async () => {

      })
    })
    describe('revealForecast()', async () => {
      it('should start a new season')
    })
    describe('close()', async () => {
      it('should start a new season')
    })
  })
})
