pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract InterpinesToken is ERC20Mintable, ERC20Detailed {
    using SafeMath for uint256;
    constructor(
        string name,
        string symbol,
        uint8 decimals
    )
    ERC20Detailed(name, symbol, decimals)
    MinterRole()
    public {
        // TODO setup initial allocation
    }

    function inflationUnit() public view returns (uint256) {
        // TODO fisher's equation
    }

    function distribute(uint256 _percentage, address[] _users, int256[] _scores) {
        uint256 scoreSum = 0;
        for (uint i = 0; i < _scores.length; i ++) {
            if (_scores[i] > 0) {
                scoreSum.add(_scores[i]);
            }
        }
        if (scoreSum > 0) {
            uint256 unit = inflationUnit().mul(_percentage).div(scoreSum).div(100);
            // TODO Check the possibility to cause the ouf of gas problem here.
            for (i = 0; i < _scores.length; i ++) {
                if (_scores[i] > 0) {
                    address beneficiary = _users[i];
                    uint256 amount = uint256(_scores[i]).mul(unit);
                    mint(beneficiary, amount);
                }
            }
        }
    }
}
