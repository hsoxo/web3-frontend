// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Counter} from "../contracts/Counter.sol";
import {MiniDaoVote} from "../contracts/MiniDaoVote.sol";

contract DeployCounter is Script {
    function run() external {
        vm.startBroadcast();
        Counter counter = new Counter();
        MiniDaoVote dao = new MiniDaoVote();
        vm.stopBroadcast();
    }
}
