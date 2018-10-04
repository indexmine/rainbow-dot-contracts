pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Season.sol";

contract League is Secondary {
    string public name;
    address public currentSeason;
    address[] public seasons;
    address[] public pastSeasons;

    constructor(string _name) Secondary() public {
        name = _name;
    }

    function prepare() public onlyPrimary returns (address) {
        Season season = new Season();
        seasons.push(season);
        return address(season);
    }

    function kickOff(address _season) public onlyPrimary returns (address) {
        require(
            Season(_season).status() == Season.SeasonStatus.READY,
            "_season argument should indicates a Season contract and it must have READY status"
        );
        require(
            currentSeason==address(0),
            "You can kick off a new season when the current season is closed"
        );
        Season(_season).start();
        currentSeason = _season;
        return currentSeason;
    }

    /**
    * @dev It apply the result and archive it.
    */
    function close() public onlyPrimary returns (bool) {
        require(
            Season(currentSeason).status() == Season.SeasonStatus.ON_RESULT,
            "You can close current season only when it has ON_RESULT status"
        );

        //  TODO: update rank
        /* implement here */
        //  TODO: mint new tokens
        /* implement here */

        Season(currentSeason).close();

        //  Archive
        pastSeasons.push(currentSeason);
        currentSeason = address(0);
    }
    function seasons() public view returns (address[]) {
        return seasons;
    }
}
