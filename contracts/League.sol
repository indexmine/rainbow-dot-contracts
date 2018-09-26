pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Season.sol";

contract League is Ownable {
    string public name;
    address public currentSeason;
    address[] public seasons;

    constructor(string _name) Ownable() public {
        name = _name;
        startNewSeason();
    }

    function startNewSeason() public onlyOwner {
        require(currentSeason==address(0));
        currentSeason = new Season();
    }
}
