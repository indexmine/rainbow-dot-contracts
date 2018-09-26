pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Season is Ownable {
    string public status;

    constructor() Ownable() public {
        status = 'preparing';
    }

    struct Season {

    }

    function _startSeason() private {
    }
}
