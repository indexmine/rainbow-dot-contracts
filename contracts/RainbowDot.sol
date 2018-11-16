pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "./RainbowDotAccount.sol";
import "./RainbowDotCommittee.sol";
import "./RainbowDotLeague.sol";
import {MinterLeague} from "./Types.sol";
import "./InterpinesToken.sol";
import "./RainbowDotAccount.sol";

contract RainbowDot {
    using Roles for Roles.Role;
    using SafeMath for uint256;

    Roles.Role private leagues;
    InterpinesToken public interpines;
    RainbowDotAccount public accounts;
    RainbowDotCommittee public committee;
    Roles.Role minterLeagues;

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
        committee.submitAgenda(_description, _league, this._handleAgendaResult);
    }

    /**
    * @dev A league can request a registration to the committee. If a new registration is submitted,
    * the committee will review it and make a result with a majority voting.
    */
    function migrateAccountManager(address _accountManager, string _description) public {
        // Revert when the address is a null address
        require(_accountManager != address(0));
        // Submit an agenda to the committee, passing a callback function to handle the result
        committee.submitAgenda(_description, _accountManager, this._setAccountManager);
    }

    /**
    * @dev Community can migrate the minter league to mint interpines token.
    * @param _minterLeague It designate a RainbotDotLeague contract which inherits
    * RainbowDotEndPriceLeague and implements MinterLeague(Types.sol)
    */
    function newMinterLeague(address _minterLeague, string _description) public {
        // Revert when the address is a null address
        require(_minterLeague != address(0));

        // Do not submit agenda if it does not implement the MinterLeague
        MinterLeague minterLeague = MinterLeague(_minterLeague);
        require(minterLeague.mintPercentagePerSeason() > 0);

        // Submit an agenda to the committee, passing a callback function to handle the result
        committee.submitAgenda(_description, _minterLeague, this._setMinterLeague);
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
        address league = msg.sender;
        // If minter league, mint new tokens
        if (minterLeagues.has(league)) {
            MinterLeague minterLeague = MinterLeague(league);
            interpines.distribute(minterLeague.mintPercentagePerSeason(), users, scores);
        }
        accounts.updateScore(users, scores);
        accounts.updateGrade();
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
    function _handleAgendaResult(address _league, bool _result) public onlyForCommittee {
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
    * @dev This function is called when the committee returns a result for the migrating account manager..
    */
    function _setAccountManager(address _accountManager, bool _result) public onlyForCommittee {
        // check the account manager address is not the null account
        require(_accountManager != address(0));
        // Apply result
    }

    /**
    * @dev This function is called when the committee returns a result for the migrating account manager..
    */
    function _setMinterLeague(address _league, bool _result) public onlyForCommittee {
        // check the league address is not the null account
        require(_league != address(0));
        // Apply result
        if (_result) {
            minterLeagues.add(_league);
        } else {
            minterLeagues.remove(_league);
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
