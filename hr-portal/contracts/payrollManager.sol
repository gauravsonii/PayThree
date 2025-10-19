// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PayrollManager is Ownable {
    IERC20 public immutable stableToken; // USDC or any ERC20
    
    event BatchPaid(address[] employees, uint256[] amounts, uint256 totalAmount);
    event Funded(uint256 amount);
    event Withdrawn(uint256 amount);
    
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        stableToken = IERC20(_token);
    }
    
    // Fund the contract with USDC (must approve before calling)
    function fundContract(uint256 amount) external onlyOwner {
        require(stableToken.transferFrom(msg.sender, address(this), amount), "Funding failed");
        emit Funded(amount);
    }
    
    // Fund with permit signature (gasless approval)
    function fundWithPermit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external onlyOwner {
        IERC20Permit(address(stableToken)).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        
        require(stableToken.transferFrom(msg.sender, address(this), amount), "Funding failed");
        emit Funded(amount);
    }
    
    // Batch payout in USDC
    function batchPay(address[] calldata employees, uint256[] calldata amounts) external onlyOwner {
        require(employees.length == amounts.length, "Mismatched arrays");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < employees.length; i++) {
            require(employees[i] != address(0), "Invalid address");
            require(amounts[i] > 0, "Invalid amount");
            require(stableToken.transfer(employees[i], amounts[i]), "Transfer failed");
            totalAmount += amounts[i];
        }
        
        emit BatchPaid(employees, amounts, totalAmount);
    }
    
    // Withdraw unused funds
    function withdraw(uint256 amount) external onlyOwner {
        require(stableToken.transfer(msg.sender, amount), "Withdraw failed");
        emit Withdrawn(amount);
    }
}