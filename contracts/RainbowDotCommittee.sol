pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Secondary.sol";

contract RainbowDotCommittee is Secondary {
    using Roles for Roles.Role;
    using SafeMath for uint256;

    struct Votes {
        uint256 up;
        uint256 down;
        mapping(address => bool) voted;
        bool resolved;
        bool result;
    }

    struct Nomination {
        address member;
        Votes votes;
    }

    struct Agenda {
        string description;
        address target;
        function(address, bool) external callback;
        function(Votes memory) internal view returns (bool, bool) resolver;
        Votes votes;
    }

    mapping(address => Nomination) nominations;
    //    mapping(address => LeagueApplication) leagueApplications;
    Agenda[] private agendas;
    Roles.Role private members;
    uint256 public memberSize = 0;

    event NewNomination(address);
    event OnNominationResult(address, bool);

    //    event NewLeagueApplication(address);
    event NewAgenda(uint256 agendaId);
    //    event OnApplicationResult(address, bool);
    event OnResult(uint256 agendaId, bool result); // agenda id

    modifier onlyForMembers {
        require(members.has(msg.sender));
        _;
    }

    constructor(address[] _committeeMembers) public {
        for (uint i = 0; i < _committeeMembers.length; i++) {
            members.add(_committeeMembers[i]);
            memberSize++;
        }
    }

    function submitAgenda(string _description, address _target, function(address, bool) external _callback) public onlyPrimary returns (uint256) {
        Agenda memory agenda;
        agenda.description = _description;
        agenda.target = _target;
        agenda.callback = _callback;
        agenda.resolver = _majorityVoting;
        agendas.push(agenda);
        emit NewAgenda(agendas.length - 1);
        return agendas.length - 1;
    }

    function nominate(address _member) public onlyForMembers {
        Nomination memory nomination;
        nomination.member = _member;
        nominations[_member] = nomination;
        emit NewNomination(_member);
    }

    function vote(uint256 _agendaId, bool _approve) external onlyForMembers {
        Agenda storage agenda = agendas[_agendaId];
        require(!agenda.votes.voted[msg.sender]);
        agenda.votes.voted[msg.sender] = true;
        if (_approve) {
            agenda.votes.up++;
        } else {
            agenda.votes.down++;
        }

        if (!agenda.votes.resolved) {
            (agenda.votes.resolved, agenda.votes.result) = agenda.resolver(agenda.votes);
            if (agenda.votes.resolved) {
                agenda.callback(agenda.target, agenda.votes.result);
                emit OnResult(_agendaId, agenda.votes.result);
            }
        }
    }

    function voteForNomination(address _member, bool _approve) external onlyForMembers {
        Nomination storage nomination = nominations[_member];
        require(!nomination.votes.voted[msg.sender]);
        nomination.votes.voted[msg.sender] = true;

        if (_approve) {
            nomination.votes.up++;
        } else {
            nomination.votes.down++;
        }

        if (!nomination.votes.resolved) {
            (nomination.votes.resolved, nomination.votes.result) = _majorityVoting(nomination.votes);
            if (nomination.votes.resolved) {
                if (nomination.votes.result) {
                    _approveMember(_member);
                } else {
                    _disapproveMember(_member);
                }
            }
        }
    }

    function _majorityVoting(Votes _votes) internal view returns (bool resolved, bool result) {
        require(memberSize > 0);
        resolved = (_votes.up >= memberSize.add(1).div(2) || _votes.down >= memberSize.add(1).div(2));
        result = _votes.up > _votes.down;
    }

    function _approveMember(address _member) private {
        if (!members.has(_member)) {
            memberSize ++;
            members.add(_member);
        }
    }

    function _disapproveMember(address _member) private {
        if (members.has(_member)) {
            memberSize --;
            members.remove(_member);
        }
    }
}
