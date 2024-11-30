pragma solidity ^0.8.13;

import {IRouter} from "./interfaces/IRouter.sol";
import {IWETH} from "./interfaces/IWETH.sol";
import {Token} from "./Token.sol";
contract Payment {
    Token public token;

    address payable prizePool;
    uint256 poolFeePerc;
    address payable team;
    uint256 teamFeePerc;

    IRouter router;
    address operator;
    uint256 slippagePerc = 99;

    event BuyIn(address indexed user, bytes32 hashedPrompt, uint256 amount);

    constructor(
        address tokenAddress,
        address prizePoolAddress,
        uint256 poolFeePerc_,
        address teamAddress,
        uint256 teamFeePerc_
    ) {
        token = Token(tokenAddress);
        router = IRouter(0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43);
        prizePool = payable(prizePoolAddress);
        team = payable(teamAddress);
        poolFeePerc = poolFeePerc_;
        teamFeePerc = teamFeePerc_;
        operator = msg.sender;
    }

    modifier isOperator() {
        require(msg.sender == operator, "Only operator can set fees");
        _;
    }

    function setOperator(address operator_) public isOperator {
        operator = operator_;
    }

    function setAddress(
        address prizePoolAddress,
        address teamAddress
    ) public isOperator {
        prizePool = payable(prizePoolAddress);
        team = payable(teamAddress);
    }

    function setFees(
        uint256 poolFeePerc_,
        uint256 teamFeePerc_
    ) public isOperator {
        require(
            poolFeePerc_ + teamFeePerc_ <= 100,
            "Total fee cannot exceed 100%"
        );
        require(
            poolFeePerc_ <= 30 && teamFeePerc_ <= 30,
            "Fee cannot exceed 30%"
        );
        poolFeePerc = poolFeePerc_;
        teamFeePerc = teamFeePerc_;
    }

    function applyFee(uint256 amount) private returns (uint256) {
        uint256 poolFee = (amount * poolFeePerc) / 100;
        uint256 teamFee = (amount * teamFeePerc) / 100;
        if (poolFee > 0) {
            (bool successPool, ) = prizePool.call{value: poolFee}("");
            require(successPool, "Pool fee transfer failed");
        }
        if (teamFee > 0) {
            (bool successTeam, ) = team.call{value: teamFee}("");
            require(successTeam, "Team fee transfer failed");
        }
        return amount - poolFee - teamFee;
    }

    function buyIn(bytes32 hashedPrompt) public payable {
        uint256 amountIn = msg.value;
        require(
            amountIn > 0.0001 ether,
            "Amount in must be greater than 0.0001 ether"
        );

        uint256 amountAfterFee = applyFee(amountIn);

        //console2.log("amountAfterFee", amountAfterFee);
        IRouter.Route[] memory routes = new IRouter.Route[](1);
        routes[0] = IRouter.Route({
            from: address(router.weth()),
            to: address(token),
            stable: false,
            factory: address(router.defaultFactory())
        });
        // calculate price with slippage
        uint256[] memory expectedAmounts = router.getAmountsOut(
            amountIn,
            routes
        );
        uint256 expectedOut = expectedAmounts[expectedAmounts.length - 1];
        uint256 amountOutMin = (expectedOut * (100 - slippagePerc)) / 100;

        //console2.log("amountOutMin", amountOutMin);
        //@test
        // uint256 amountOutMin = 1;

        router.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: amountAfterFee
        }(amountOutMin, routes, msg.sender, block.timestamp + 60 * 2);

        emit BuyIn(msg.sender, hashedPrompt, amountIn);
    }
    fallback() external payable {
        revert("Fallback function not supported");
    }
    receive() external payable {
        revert("Receive function not supported");
    }
}
