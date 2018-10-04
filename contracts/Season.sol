pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./League.sol";

contract Season is Secondary {

    struct OracleCandidate {
        address oracle;
        address[] votes;
    }

    address[] public oracleCandidates;
    mapping(address=>uint) voteStats;
    mapping(address=>address) votes;

    enum SeasonStatus {OPENED, READY, ONGOING, ON_RESULT, CLOSED, FORCED_CLOSED}

    event SeasonOpened(SeasonStatus indexed status, address season);

    SeasonStatus public status;

    constructor() Secondary() public {
        _changeStatus(SeasonStatus.OPENED);
    }

//    function registerOracleCandidate(address _candidate) {
//
//    }

    function ready() public onlyPrimary returns (bool) {
        require(status==SeasonStatus.OPENED);
        _changeStatus(SeasonStatus.READY);
    }

    function start() public onlyPrimary returns (bool) {
        require(status==SeasonStatus.READY);
        _changeStatus(SeasonStatus.ONGOING);
    }

    function _changeStatus(SeasonStatus _status) private returns (bool) {
        if(status != _status) { // TODO: test enum < enum
            status = _status;
            emit SeasonOpened(_status, address(this));
        }
    }

    function close() public onlyPrimary returns (bool) {
        require(status==SeasonStatus.ON_RESULT);
        _changeStatus(SeasonStatus.CLOSED);
    }

    function forceClose() public onlyPrimary returns (bool) {
        require(status!=SeasonStatus.CLOSED);
        _changeStatus(SeasonStatus.FORCED_CLOSED);
    }
}
