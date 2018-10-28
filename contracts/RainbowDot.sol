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
        // Deploy RainbowDot Account.
        // This RainbowDot contract will be the primary contract of the RainbowDotAccount contract.
        accounts = new RainbowDotAccount();
        // Setup committee with initial committee members
        committee = new RainbowDotCommittee(initialCommittee);
    }

    /**
     * @dev Users should create a Rainbow Dot account to participate leagues
     */
    function join() external {
        accounts.addUser(msg.sender);
    }

    /**
     * @dev A league can request a registration to the committee. If a new registration is submitted,
     * the committee will review it and make a result with a majority voting.
     */
    function requestLeagueRegistration(address _league, string _description) public {
        // Revert when a league is already approved
        require(!leagues.has(_league));
        // Submit an agenda to the committee and get agenda id for the registration
        // Pass a callback function to hanlde the result
        uint256 id = committee.submitAgenda(_description, this._handleAgendaResult);
        // Does not allow duplicated registration
        require(registrationRequests[id] == address(0));
        // Store the agenda id and league information to use when it is approved
        registrationRequests[id] = _league;
    }

    /**
     * @dev Approved leagues will take away the RDots from user's account.
     */
    function takeRDot(address _user, uint256 _amount) public onlyForLeagues {
        accounts.useRDots(_user, _amount);
    }

    /**
     * @dev Approved leagues update rScores as a result
     */
    function applyResult(address[] users, int256[] scores) public onlyForLeagues {
        // TODO mint interpines tokens
        // update rScores
        // update grades
    }

    /**
     * @dev Return the league is approved or not
     */
    function isApprovedLeague(address _league) public view returns (bool) {
        return leagues.has(_league);
    }

    /**
     * @dev This function is called when the committee returns a screening result for the registration.
     * And if it passes te screening, this gives permissions to take rDots and update rScores to the league.
     */
    function _handleAgendaResult(uint256 _agendaId, bool _result) public onlyForCommittee {
        // get league address for the given agenda
        address _league = registrationRequests[_agendaId];
        // check the league address is not the null account
        require(_league != address(0));
        // Apply result
        if (_result) {
            _approveLeague(_league);
        } else {
            _disapproveLeague(_league);
        }
    }

    /**
     * @dev This is a private function to set a league as an approved
     */
    function _approveLeague(address _league) private {
        // Works when only the league is not already registered
        require(!leagues.has(_league));
        // Add the league to the list of approved leagues
        leagues.add(_league);
        // Give permissions to take rdots and update rScores to the league
        RainbowDotLeague(_league).accept(this.takeRDot, this.applyResult);
    }

    /**
     * @dev This is a private function to set a league as a disapproved
     */
    function _disapproveLeague(address _league) private {
        // Works when only the league is already registered
        require(leagues.has(_league));
        // Remove the league from the list of approved leagues
        leagues.remove(_league);
    }
}
