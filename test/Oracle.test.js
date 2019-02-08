const chai = require('chai')
const assert = chai.assert
const BigNumber = web3.BigNumber
chai.use(require('chai-bignumber')(BigNumber)).should()

const Oracle = artifacts.require('Oracle')

contract('Oracle', function ([operator, attacker, ...accounts]) {
  describe('isVerified()', function () {
    let oracle
    const SAMPLE_DATA = web3.utils.toHex(JSON.stringify({ foo: 'bar', foo2: 'bar2', foo3: 'bar3' }))
    beforeEach(async () => {
      oracle = await Oracle.new({ from: operator })
    })
    it('should return true when the signature is signed with the key of the oracle operator', async () => {
      const signature = await web3.eth.sign(web3.utils.sha3(SAMPLE_DATA), operator)
      assert.isTrue(await oracle.isVerified(SAMPLE_DATA, signature))
    })

    it('should return false when the signature is not signed with the key of the oracle operator', async () => {
      const signature = await web3.eth.sign(web3.utils.sha3(SAMPLE_DATA), attacker)
      assert.isNotTrue(await oracle.isVerified(SAMPLE_DATA, signature))
    })
  })
})
