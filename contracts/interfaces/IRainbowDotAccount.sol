pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";

contract IRainbowDotAccount is Secondary {
    using Roles for Roles.Role;

    address[] public userList;
    Roles.Role internal users;
    mapping(address => Account) internal accounts;

    enum Grade {PURPLE, NAVY, BLUE, GREEN, YELLOW, ORANGE, RED}

    struct Account {
        uint256 rDots;
        uint256 lastUse;
        mapping(uint256 => int256) rScores;
    }

    function addUser(address _user) public;

    function useRDots(address _user, uint256 _rDots) public;

    function updateScore(address[] _users, int256[] _scores) public;

    function updateGrade() public;

    function exist(address _user) public view returns (bool);

    function getAccount(address _user) public view returns (uint256 rDots, int256 rScore, uint256 lastUse, Grade grade);

    function getAvailableRDots(address _user) public view returns (uint256);

    function getGrade(address _user) public view returns (Grade);

    function getCurrentSeasonScore(address _user) public view returns (int256);

    function getScoreOfSpecificSeason(address _user, uint256 _seasonNum) public view returns (int256);
}
