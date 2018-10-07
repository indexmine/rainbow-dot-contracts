pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Oracle is Secondary {
    using ECDSA for bytes32;

    constructor() Secondary() public {
    }

    function isVerified(bytes data, bytes _signature) public view returns (bool) {
        return primary() == toEthSignedMessageHash(keccak256(data)).recover(_signature);
    }

    function toEthSignedMessageHash(bytes32 hash) private pure returns (bytes32) {
        return hash.toEthSignedMessageHash();
    }
}
