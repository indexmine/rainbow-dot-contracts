pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "./RainbowDotAccount.sol";
import "./RainbowDotCommittee.sol";
import "./RainbowDotLeague.sol";

contract RainbowDot {
    using Roles for Roles.Role;
    using SafeMath for uint256;

    mapping(uint256 => address) private registrationRequests;
    Roles.Role private leagues;
    RainbowDotAccount private accounts;
    RainbowDotCommittee public committee;

    modifier onlyForLeagues {
        require(leagues.has(msg.sender));
        _;
    }

    modifier onlyForCommittee {
        require(msg.sender == address(committee));
        _;
    }

    constructor (address[] initialCommittee) {
        accounts = new RainbowDotAccount();
        committee = new RainbowDotCommittee(initialCommittee);
    }

    function join() external {
        accounts.addUser(msg.sender);
    }


    function requestLeagueRegistration(address _league, string _description) public {
        require(!leagues.has(_league));
        uint256 id = committee.submitAgenda(_description, this._handleAgendaResult);
        require(registrationRequests[id] == address(0));
        registrationRequests[id] = _league;
    }

    function takeRDot(address _user, uint256 _amount) public onlyForLeagues {
        accounts.useRDots(_user, _amount);
    }

    function applyResult(address[] users, int256[] scores) public onlyForLeagues {
        // update rScores
        // update grades
    }

    function isApprovedLeague(address _league) public view returns (bool) {
        return leagues.has(_league);
    }

    function _handleAgendaResult(uint256 _agendaId, bool _result) public onlyForCommittee {
        address _league = registrationRequests[_agendaId];
        require(_league != address(0));
        if (_result) {
            _approveLeague(_league);
        } else {
            _disapproveLeague(_league);
        }
    }

    function _approveLeague(address _league) private {
        require(!leagues.has(_league));
        leagues.add(_league);
        RainbowDotLeague(_league).accept(this.takeRDot, this.applyResult);
    }

    function _disapproveLeague(address _league) private {
        require(leagues.has(_league));
        leagues.remove(_league);
    }
}
