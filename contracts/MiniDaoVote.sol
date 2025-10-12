// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MiniDaoVote {
    struct Proposal {
        string description;
        uint32 id;
        uint64 deadline;
        uint64 votesFor;
        uint64 votesAgainst;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteSupport;
    }

    struct ProposalView {
        string description;
        uint32 id;
        uint64 deadline;
        uint64 votesFor;
        uint64 votesAgainst;
        bool executed;
        bool hasVoted;
        bool support;
    }

    address public owner;
    uint32 public proposalCount;
    mapping(uint32 => Proposal) public proposals;

    event ProposalCreated(uint32 id, string description, uint64 deadline);
    event VoteCast(address indexed voter, uint32 indexed proposalId, bool support);
    event ProposalExecuted(uint32 indexed proposalId, bool passed);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function createProposal(string memory _description, uint64 _durationSeconds) public {
        unchecked { proposalCount++; }
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.description = _description;
        p.deadline = uint64(block.timestamp + _durationSeconds);
        emit ProposalCreated(proposalCount, _description, p.deadline);
    }

    function deleteProposal(uint32 _proposalId) public onlyOwner {
        delete proposals[_proposalId];
    }

    function vote(uint32 _proposalId, bool _support) public {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp < p.deadline, "Voting ended");
        require(!p.hasVoted[msg.sender], "Already voted");

        p.hasVoted[msg.sender] = true;
        p.voteSupport[msg.sender] = _support;
        if (_support) {
            unchecked { p.votesFor++; }
        } else {
            unchecked { p.votesAgainst++; }
        }

        emit VoteCast(msg.sender, _proposalId, _support);
    }

    function execute(uint32 _proposalId) public {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp >= p.deadline, "Not ended yet");
        require(!p.executed, "Already executed");

        p.executed = true;
        bool passed = p.votesFor > p.votesAgainst;
        emit ProposalExecuted(_proposalId, passed);
    }

    function getProposal(uint32 _proposalId)
        public
        view
        returns (
            uint32 id,
            string memory description,
            uint64 deadline,
            uint64 votesFor,
            uint64 votesAgainst,
            bool executed
        )
    {
        Proposal storage p = proposals[_proposalId];
        return (p.id, p.description, p.deadline, p.votesFor, p.votesAgainst, p.executed);
    }

    function hasVoted(uint32 _proposalId, address _voter) public view returns (bool) {
        Proposal storage p = proposals[_proposalId];
        return p.hasVoted[_voter];
    }

    function getAllProposals() public view returns (ProposalView[] memory) {
        ProposalView[] memory proposalsArray = new ProposalView[](proposalCount);
        
        for (uint32 i = 1; i <= proposalCount; i++) {
            Proposal storage p = proposals[i];
            proposalsArray[i - 1] = ProposalView({
                id: p.id,
                description: p.description,
                deadline: p.deadline,
                votesFor: p.votesFor,
                votesAgainst: p.votesAgainst,
                executed: p.executed,
                hasVoted: p.hasVoted[msg.sender],
                support: p.voteSupport[msg.sender]
            });
        }
        return proposalsArray;
    }
}
