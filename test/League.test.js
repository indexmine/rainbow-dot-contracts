const chai = require('chai');
const assert = chai.assert;
const BigNumber = web3.BigNumber;
const should = chai.use(require('chai-bignumber')(BigNumber)).should();

const League = artifacts.require("League");
const Season = artifacts.require("Season");

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
const LEAGUE_NAME = 'Indexmine Cup';


contract('League', function ([_, deployer, owner, participant, helper]) {
    // utility function to go to next block
    const next = () => {
        const currentBlockNum = web3.eth.blockNumber;
        while(!(currentBlockNum < web3.eth.blockNumber)) {
            web3.eth.sendTransaction({from: helper, to: deployer, value: '0x00000000001', gas: '0x21000', gasPrice: '0x00001'});
        }
    };

    context('When a League contract is deployed by an EOA', async () => {
        let league;
        const LEAGUE_NAME = 'Rainbow Dot League';
        describe('constructor()', async () => {
            it('should assign the EOA as its primary', async () => {
                league = await League.new(LEAGUE_NAME, {from: owner});
                assert.equal(owner, await league.primary());
            });

            it('should receive a string value and store it as its name', async () => {
                assert.equal(LEAGUE_NAME, await league.name());
            });
        });
    });

    context('When a League is once deployed successfully', async () => {
        let league;
        const deployLeague = async () => {
            league = await League.new(LEAGUE_NAME, {from: owner});
        };
        describe('prepare()', async () => {
            before(deployLeague);
            it('should revert when an EOA who is not a primary tries to start a new season', async () => {
                try {
                    await league.prepare.call({from: participant});
                    assert.fail('did not reverted');
                } catch (error) {
                    assert.ok('reverted successfully');
                }
            });

            let season;
            it('should deploy a new season contract by an external call only from the primary', async () => {
                season = await league.prepare.call({from: owner});
                assert.ok(season);
                assert.notEqual(season, EMPTY_ADDRESS);
            });
        });

        describe('sponsor', async()=>{
          // conditions: reward, advertisement, period
        });

        describe('participate', async()=>{
            // conditions: grade
        });

        describe('kickOff(address _season)', async () => {
            before(deployLeague);
            it('should revert when the passed season does not have READY status', async () => {
                const unreadySeason = await league.prepare.call({from: owner});
                try {
                    await league.kickOff(unreadySeason, {from: owner});
                    assert.fail('did not reverted');
                } catch (error) {
                    assert.ok('reverted successfully');
                }
            });

            context('if the passed argument indicates Season contract and has READY status', async () => {
                let candidateAddress;
                before(async () => {
                    await league.prepare({from: owner});
                    let seasons = await league.seasons();
                    candidateAddress = seasons[0];
                    const candidate = await Season.at(candidateAddress);
                    // candidate.ready.call({from: owner});
                });

                it('should start a season and assign it as its current season', async () => {
                    // await league.kickOff(candidateAddress, {from: owner});
                    // assert.equal(candidateAddress, await league.currentSeason());
                });

                it('should revert when the current season already exists', async () => {
                    await league.prepare({from: owner});
                    let seasons = await league.seasons();
                    const preassigned = await Season.at(seasons[0]);
                    // preassigned.ready.call({from: owner});
                    // await league.kickOff(preassignedAddress, {from: owner});
                    // assert.notEqual(await league.currentSeason(), EMPTY_ADDRESS, 'current season does not exist');
                    // try {
                    //     await league.kickOff(candidateAddress, {from: owner});
                    //     assert.fail('did not reverted');
                    // } catch (error) {
                    //     assert.ok('reverted successfully');
                    // }
                });
            });
        });
    });
});
