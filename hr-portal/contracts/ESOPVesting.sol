// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ESOPVesting {
    struct Vesting {
        uint256 totalAmount;
        uint256 claimed;
        uint256 start;
        uint256 cliff;
        uint256 duration;
    }
    
    address public owner;
    mapping(address => Vesting) public vestings;
    address[] public employeeList;
    
    event EmployeeAdded(
        address indexed employee,
        uint256 totalAmount,
        uint256 start,
        uint256 cliff,
        uint256 duration
    );
    
    event EmployeeRemoved(
        address indexed employee,
        uint256 refundedAmount
    );
    
    event TokensClaimed(
        address indexed employee,
        uint256 amount
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function addEmployee(
        address _employee,
        uint256 _start,
        uint256 _cliffMonths,
        uint256 _vestingMonths
    ) external payable onlyOwner {
        require(_employee != address(0), "Invalid employee address");
        require(msg.value > 0, "Must send tokens for vesting");
        require(vestings[_employee].totalAmount == 0, "Employee already exists");
        
        uint256 startTime = _start;
        uint256 cliffTime = startTime + (_cliffMonths * 30 days);
        uint256 duration = _vestingMonths * 30 days;
        
        vestings[_employee] = Vesting({
            totalAmount: msg.value,
            claimed: 0,
            start: startTime,
            cliff: cliffTime,
            duration: duration
        });
        
        employeeList.push(_employee);
        
        emit EmployeeAdded(_employee, msg.value, _start, cliffTime, duration);
    }
    
    function removeEmployee(address _employee) external onlyOwner {
        require(vestings[_employee].totalAmount > 0, "Employee not found");
        
        uint256 vested = vestedAmount(_employee);
        uint256 refundAmount = vestings[_employee].totalAmount - vested;
        
        // Remove from employee list
        for (uint256 i = 0; i < employeeList.length; i++) {
            if (employeeList[i] == _employee) {
                employeeList[i] = employeeList[employeeList.length - 1];
                employeeList.pop();
                break;
            }
        }
        
        // Clear vesting data
        delete vestings[_employee];
        
        // Refund unvested tokens to owner
        if (refundAmount > 0) {
            payable(owner).transfer(refundAmount);
        }
        
        emit EmployeeRemoved(_employee, refundAmount);
    }
    
    function claim() external {
        require(vestings[msg.sender].totalAmount > 0, "No vesting found");
        
        uint256 vested = vestedAmount(msg.sender);
        uint256 claimable = vested - vestings[msg.sender].claimed;
        
        require(claimable > 0, "No tokens available to claim");
        
        vestings[msg.sender].claimed += claimable;
        
        payable(msg.sender).transfer(claimable);
        
        emit TokensClaimed(msg.sender, claimable);
    }
    
    function vestedAmount(address _employee) public view returns (uint256) {
        Vesting memory vesting = vestings[_employee];
        
        if (vesting.totalAmount == 0) {
            return 0;
        }
        
        // If before cliff, nothing is vested
        if (block.timestamp < vesting.cliff) {
            return 0;
        }
        
        // If after full vesting period, everything is vested
        if (block.timestamp >= vesting.start + vesting.duration) {
            return vesting.totalAmount;
        }
        
        // Calculate proportional vesting
        uint256 timeVested = block.timestamp - vesting.start;
        return (vesting.totalAmount * timeVested) / vesting.duration;
    }
    
    function getAllVestings() external view returns (address[] memory, Vesting[] memory) {
        Vesting[] memory allVestings = new Vesting[](employeeList.length);
        
        for (uint256 i = 0; i < employeeList.length; i++) {
            allVestings[i] = vestings[employeeList[i]];
        }
        
        return (employeeList, allVestings);
    }
}