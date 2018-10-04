const ethUtil = require('ethereumjs-util');
const {signMessage, toEthSignedMessageHash} = require('openzeppelin-solidity/test/helpers/sign');

const chai = require('chai');
const assert = chai.assert;
const BigNumber = web3.BigNumber;
const should = chai.use(require('chai-bignumber')(BigNumber)).should();

const Oracle = artifacts.require("Oracle");

contract('Oracle', function ([operator, attacker, user]) {
    describe('isVerified()', function () {
        let oracle;
        const SAMPLE_DATA = JSON.stringify({foo: 'bar', foo2: 'bar2', foo3: 'bar3'});
        beforeEach(async () => {
            oracle = await Oracle.new({from: operator});
        });
        it('should return true when the signature is signed with the key of the oracle operator', async () => {
            const signature = signMessage(operator, web3.sha3(SAMPLE_DATA));
            assert.isTrue(await oracle.isVerified(SAMPLE_DATA, signature));
        });

        it('should return false when the signature is not signed with the key of the oracle operator', async () => {
            const signature = signMessage(attacker, web3.sha3(SAMPLE_DATA));
            assert.isNotTrue(await oracle.isVerified(SAMPLE_DATA, signature));
        });
    });
});
