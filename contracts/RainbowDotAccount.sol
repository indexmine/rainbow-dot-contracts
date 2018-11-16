pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";
import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import {DateTime} from "../libs/pipermerriam/ethereum-datetime/contracts/DateTime.sol";

contract RainbowDotAccount is DateTime, Secondary {
    using Roles for Roles.Role;
    using SafeMath for uint256;
    enum Grade {PURPLE, NAVY, BLUE, GREEN, YELLOW, ORANGE, RED}

    struct Account {
        // TODO change rDots to RDOtProvider Contract (by Committee)
        uint256 rDots;
        uint256 rScore;
        uint256 lastUse;
        Grade grade;
    }

    uint256 constant public INITIAL_SUPPLY = 20;
    uint256 constant public MONTHLY_SUPPLY = 10;
    Roles.Role private users;
    mapping(address => Account) private accounts;

    constructor () Secondary() {
    }

    function addUser(address _user) public onlyPrimary {
        require(!users.has(_user));
        users.add(_user);
        accounts[_user] = Account(INITIAL_SUPPLY, 0, now, Grade.PURPLE);
    }

    function useRDots(address _user, uint256 _rDots) public onlyPrimary {
        require(_rDots <= getAvailableRDots(_user));
        Account storage account = accounts[_user];
        require(_rDots <= uint256(account.grade).add(1));
        account.rDots = getAvailableRDots(_user) - _rDots;
        account.lastUse = now;
    }

    function updateScore(address[] _users, int256[] _scores) public onlyPrimary {
        for (uint256 i = 0; i < _users.length; i++) {
            if (_scores[i] > 0) {
                accounts[_users[i]].rScore.add(_scores[i]);
            } else {
                accounts[_users[i]].rScore.sub(uint256(- _scores[i]));
            }
        }
    }

    function updateGrade() public onlyPrimary {

    }

    function exist(address _user) public view returns (bool) {
        return users.has(_user);
    }

    function getAccount(address _user) public view returns (
        uint256 rDots,
        uint256 rScore,
        uint256 lastUse,
        Grade grade)
    {
        require(!users.has(_user));
        Account memory account = accounts[_user];
        rDots = getAvailableRDots(_user);
        rScore = account.rScore;
        lastUse = account.lastUse;
        grade = account.grade;
    }

    function getAvailableRDots(address _user) public view returns (uint256) {
        require(users.has(_user));
        Account memory account = accounts[_user];
        if (account.rDots < MONTHLY_SUPPLY && !_isOnSameMonth(account.lastUse, now)) {
            //  on reset condition
            return MONTHLY_SUPPLY;
        } else {
            return account.rDots;
        }
    }

    function _isOnSameMonth(
        uint256 _timestamp1,
        uint256 _timestamp2
    ) internal pure returns (bool) {
        _DateTime memory dt1 = parseTimestamp(_timestamp1);
        _DateTime memory dt2 = parseTimestamp(_timestamp2);
        return (dt1.year == dt2.year && dt1.month == dt2.month);
    }
}
