import Web3 from "web3-eth-contract";
import contract from "./contracts/Project.json";

const address = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";
const abi = contract.abi;

export default new Web3(abi, address);
