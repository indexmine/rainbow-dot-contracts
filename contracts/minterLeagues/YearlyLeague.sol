pragma solidity ^0.4.24;

import "../Types.sol";
import "../RainbowDotEndPriceLeague.sol";

contract AnnualLeague is MinterLeague, RainbowDotEndPriceLeague {
    uint256 constant PERCENTAGE_PER_SEASON = 10;

    constructor (address _oracle, string _description)
    public
    RainbowDotEndPriceLeague(_oracle, _description) {
    }

    function mintPercentagePerSeason() public pure returns (uint256){
       return PERCENTAGE_PER_SEASON;
    }
}