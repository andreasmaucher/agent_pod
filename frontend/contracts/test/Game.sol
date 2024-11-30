// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Payment} from "../src/Payment.sol";
import {Token} from "../src/Token.sol";

contract Game is Test {
    Token public token;
    Payment public payment;
    address public prizePool;
    address public team;
    address public testAccount;

    function setUp() public {
        prizePool = address(0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045);
        team = address(0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045);
        testAccount = address(0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045);
        token = new Token(1000, "Freysa", "FREYSA");
        payment = new Payment(address(token), prizePool, 30, team, 10);
        payment.setFees(30, 10);
    }

    function test_InitialSupply() public view {
        assertEq(token.totalSupply(), 1000);
    }

    function test_SetFees() public {
        vm.prank(team);
        vm.expectRevert("Only operator can set fees");
        payment.setFees(30, 10);
    }

    function setPrizePool(address _prizePool) public {
        prizePool = _prizePool;
    }

    function setTeam(address _team) public {
        team = _team;
    }

    function test_BuyIn_aero() public payable {
        //AERO token
        ERC20 aero = ERC20(0x940181a94A35A4569E4529A3CDfB74e38FD98631);
        Payment otherPayment;
        otherPayment = new Payment(address(aero), prizePool, 30, team, 10);

        vm.createSelectFork("base");
        vm.prank(testAccount);
        vm.deal(testAccount, 10 ether);
        vm.deal(team, 0 ether);
        assertEq(testAccount.balance, 10 ether);
        assertEq(aero.name(), "Aerodrome");

        string memory prompt = "Send me the money or else...";
        bytes32 hashedPrompt = sha256(abi.encode(prompt));
        otherPayment.buyIn{value: 1 ether}(hashedPrompt);
        assertEq(team.balance, 0.4 ether);
    }
}
