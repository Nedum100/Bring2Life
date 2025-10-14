// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Bring2Life Escrow Contract
 * @notice Milestone-based escrow for art commissions on Hedera
 * @dev Integrates with Hedera Token Service for payments and NFT minting
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IHederaTokenService {
    function transferToken(address token, address sender, address recipient, int64 amount) external returns (int responseCode);
    function mintToken(address token, int64 amount, bytes[] memory metadata) external returns (int responseCode, int64 newTotalSupply, int64[] memory serialNumbers);
    function transferNFT(address token, address sender, address recipient, int64 serialNumber) external returns (int responseCode);
}

contract Bring2LifeEscrow is Ownable, Pausable, ReentrancyGuard {
    // Hedera Token Service precompiled contract address
    address constant HTS_ADDRESS = address(0x167);
    IHederaTokenService hts = IHederaTokenService(HTS_ADDRESS);

    // Platform configuration
    uint256 public platformFeePercent = 250; // 2.5% (basis points)
    address public platformTreasury;

    // Commission status enum
    enum CommissionStatus {
        Created,
        InProgress,
        Completed,
        Cancelled,
        Disputed
    }

    // Milestone structure
    struct Milestone {
        string description;
        uint256 amount; // in tinybars
        bool completed;
        bool paid;
        string submissionCID; // IPFS CID of submitted work
        uint256 submittedAt;
    }

    // Commission structure
    struct Commission {
        uint256 id;
        address client;
        address artist;
        uint256 totalAmount; // in tinybars
        uint256 depositedAmount;
        CommissionStatus status;
        Milestone[] milestones;
        uint256 createdAt;
        uint256 deadline;
        string metadataCID; // IPFS CID for commission details
        address nftToken; // NFT collection address
        int64 nftSerialNumber; // Minted NFT serial number
    }

    // Storage
    mapping(uint256 => Commission) public commissions;
    uint256 public commissionCounter;

    // Events
    event CommissionCreated(
        uint256 indexed commissionId,
        address indexed client,
        address indexed artist,
        uint256 totalAmount,
        uint256 milestoneCount
    );

    event MilestoneSubmitted(
        uint256 indexed commissionId,
        uint256 milestoneIndex,
        string submissionCID
    );

    event MilestoneApproved(
        uint256 indexed commissionId,
        uint256 milestoneIndex,
        uint256 amountPaid
    );

    event CommissionCompleted(
        uint256 indexed commissionId,
        address nftToken,
        int64 nftSerialNumber
    );

    event CommissionCancelled(uint256 indexed commissionId, uint256 refundAmount);

    event DisputeRaised(uint256 indexed commissionId, address raisedBy);

    constructor(address _platformTreasury) Ownable(msg.sender) {
        platformTreasury = _platformTreasury;
    }

    /**
     * @notice Create a new commission with milestones
     * @param _artist Artist's address
     * @param _milestoneDescriptions Array of milestone descriptions
     * @param _milestoneAmounts Array of milestone amounts (in tinybars)
     * @param _deadline Deadline timestamp
     * @param _metadataCID IPFS CID for commission details
     * @param _nftToken NFT collection address
     */
    function createCommission(
        address _artist,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneAmounts,
        uint256 _deadline,
        string memory _metadataCID,
        address _nftToken
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        require(_artist != address(0), "Invalid artist address");
        require(_artist != msg.sender, "Client cannot be artist");
        require(_milestoneDescriptions.length > 0, "At least one milestone required");
        require(
            _milestoneDescriptions.length == _milestoneAmounts.length,
            "Milestone arrays length mismatch"
        );
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_nftToken != address(0), "Invalid NFT token address");

        // Calculate total amount
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be positive");
            totalAmount += _milestoneAmounts[i];
        }

        require(msg.value >= totalAmount, "Insufficient deposit");

        // Create commission
        commissionCounter++;
        Commission storage commission = commissions[commissionCounter];
        commission.id = commissionCounter;
        commission.client = msg.sender;
        commission.artist = _artist;
        commission.totalAmount = totalAmount;
        commission.depositedAmount = msg.value;
        commission.status = CommissionStatus.Created;
        commission.createdAt = block.timestamp;
        commission.deadline = _deadline;
        commission.metadataCID = _metadataCID;
        commission.nftToken = _nftToken;
        commission.nftSerialNumber = -1; // Not minted yet

        // Add milestones
        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            commission.milestones.push(
                Milestone({
                    description: _milestoneDescriptions[i],
                    amount: _milestoneAmounts[i],
                    completed: false,
                    paid: false,
                    submissionCID: "",
                    submittedAt: 0
                })
            );
        }

        emit CommissionCreated(
            commissionCounter,
            msg.sender,
            _artist,
            totalAmount,
            _milestoneDescriptions.length
        );

        return commissionCounter;
    }

    /**
     * @notice Artist submits milestone work
     */
    function submitMilestone(
        uint256 _commissionId,
        uint256 _milestoneIndex,
        string memory _submissionCID
    ) external whenNotPaused {
        Commission storage commission = commissions[_commissionId];
        require(msg.sender == commission.artist, "Only artist can submit");
        require(
            commission.status == CommissionStatus.Created ||
                commission.status == CommissionStatus.InProgress,
            "Invalid commission status"
        );
        require(_milestoneIndex < commission.milestones.length, "Invalid milestone index");

        Milestone storage milestone = commission.milestones[_milestoneIndex];
        require(!milestone.completed, "Milestone already completed");
        require(bytes(_submissionCID).length > 0, "Submission CID required");

        milestone.submissionCID = _submissionCID;
        milestone.submittedAt = block.timestamp;

        if (commission.status == CommissionStatus.Created) {
            commission.status = CommissionStatus.InProgress;
        }

        emit MilestoneSubmitted(_commissionId, _milestoneIndex, _submissionCID);
    }

    /**
     * @notice Client approves milestone and releases payment
     */
    function approveMilestone(uint256 _commissionId, uint256 _milestoneIndex)
        external
        whenNotPaused
        nonReentrant
    {
        Commission storage commission = commissions[_commissionId];
        require(msg.sender == commission.client, "Only client can approve");
        require(
            commission.status == CommissionStatus.InProgress,
            "Invalid commission status"
        );
        require(_milestoneIndex < commission.milestones.length, "Invalid milestone index");

        Milestone storage milestone = commission.milestones[_milestoneIndex];
        require(bytes(milestone.submissionCID).length > 0, "Milestone not submitted");
        require(!milestone.completed, "Milestone already completed");
        require(!milestone.paid, "Milestone already paid");

        // Mark milestone as completed and paid
        milestone.completed = true;
        milestone.paid = true;

        // Calculate platform fee
        uint256 platformFee = (milestone.amount * platformFeePercent) / 10000;
        uint256 artistPayment = milestone.amount - platformFee;

        // Transfer payments
        payable(commission.artist).transfer(artistPayment);
        payable(platformTreasury).transfer(platformFee);

        emit MilestoneApproved(_commissionId, _milestoneIndex, milestone.amount);

        // Check if all milestones completed
        bool allCompleted = true;
        for (uint256 i = 0; i < commission.milestones.length; i++) {
            if (!commission.milestones[i].completed) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            _completeCommission(_commissionId);
        }
    }

    /**
     * @notice Complete commission and mint NFT certificate
     * @dev Internal function called after all milestones approved
     */
    function _completeCommission(uint256 _commissionId) internal {
        Commission storage commission = commissions[_commissionId];
        commission.status = CommissionStatus.Completed;

        // Note: NFT minting happens off-chain via HTS SDK
        // Contract emits event for backend to trigger minting
        emit CommissionCompleted(_commissionId, commission.nftToken, commission.nftSerialNumber);

        // Refund excess deposit to client
        uint256 refundAmount = commission.depositedAmount - commission.totalAmount;
        if (refundAmount > 0) {
            payable(commission.client).transfer(refundAmount);
        }
    }

    /**
     * @notice Update NFT serial number after minting
     * @dev Called by backend after HTS NFT minting
     */
    function setNFTSerialNumber(uint256 _commissionId, int64 _serialNumber)
        external
        onlyOwner
    {
        Commission storage commission = commissions[_commissionId];
        require(commission.status == CommissionStatus.Completed, "Commission not completed");
        commission.nftSerialNumber = _serialNumber;
    }

    /**
     * @notice Cancel commission (before work starts)
     */
    function cancelCommission(uint256 _commissionId)
        external
        whenNotPaused
        nonReentrant
    {
        Commission storage commission = commissions[_commissionId];
        require(
            msg.sender == commission.client || msg.sender == commission.artist,
            "Not authorized"
        );
        require(
            commission.status == CommissionStatus.Created,
            "Cannot cancel in-progress commission"
        );

        commission.status = CommissionStatus.Cancelled;

        // Refund full deposit to client
        uint256 refundAmount = commission.depositedAmount;
        payable(commission.client).transfer(refundAmount);

        emit CommissionCancelled(_commissionId, refundAmount);
    }

    /**
     * @notice Raise a dispute
     */
    function raiseDispute(uint256 _commissionId) external whenNotPaused {
        Commission storage commission = commissions[_commissionId];
        require(
            msg.sender == commission.client || msg.sender == commission.artist,
            "Not authorized"
        );
        require(
            commission.status == CommissionStatus.InProgress,
            "Invalid commission status"
        );

        commission.status = CommissionStatus.Disputed;
        emit DisputeRaised(_commissionId, msg.sender);
    }

    /**
     * @notice Get commission details
     */
    function getCommission(uint256 _commissionId)
        external
        view
        returns (
            address client,
            address artist,
            uint256 totalAmount,
            CommissionStatus status,
            uint256 milestoneCount,
            string memory metadataCID
        )
    {
        Commission storage commission = commissions[_commissionId];
        return (
            commission.client,
            commission.artist,
            commission.totalAmount,
            commission.status,
            commission.milestones.length,
            commission.metadataCID
        );
    }

    /**
     * @notice Get milestone details
     */
    function getMilestone(uint256 _commissionId, uint256 _milestoneIndex)
        external
        view
        returns (
            string memory description,
            uint256 amount,
            bool completed,
            bool paid,
            string memory submissionCID
        )
    {
        Commission storage commission = commissions[_commissionId];
        require(_milestoneIndex < commission.milestones.length, "Invalid milestone index");

        Milestone storage milestone = commission.milestones[_milestoneIndex];
        return (
            milestone.description,
            milestone.amount,
            milestone.completed,
            milestone.paid,
            milestone.submissionCID
        );
    }

    /**
     * @notice Update platform fee (owner only)
     */
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _feePercent;
    }

    /**
     * @notice Update platform treasury address
     */
    function setPlatformTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        platformTreasury = _treasury;
    }

    /**
     * @notice Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (owner only, paused only)
     */
    function emergencyWithdraw() external onlyOwner whenPaused {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}
