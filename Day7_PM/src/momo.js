import React, { useState } from 'react';
import Web3 from 'web3';
import './App.css';

const contractJson = require("./LendableSBT.json");
const web3 = new Web3("http://127.0.0.1:9545");
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xC98031d7f50b9d2291E9adf305c00652CB2c874a";
const contract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
    from: "0x2f6d487de1705340ef0b05ba416c9c7c89408549",
});

function App() {
    // States
    const [owner, setOwner] = useState("0x2f6d487de1705340ef0b05ba416c9c7c89408549");
    const [privateKey, setPrivateKey] = useState("681dc3f4126d2e935a99b101deae80b8ade75fe06f6647f304ab4cd5026ad5b0");
    const [output, setOutput] = useState("");
    const [renter, setRenter] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [expire, setExpire] = useState("");
    const [rewardAmount, setRewardAmount] = useState("");

    const mintToken = async () => {
        try {
            const nonce = await web3.eth.getTransactionCount(owner, 'latest');
            const data = contract.methods.mint(owner).encodeABI();
            const gas = await contract.methods.mint(owner).estimateGas();
            const gasPrice = await web3.eth.getGasPrice();
           
            const tx = await web3.eth.accounts.signTransaction({
                nonce: "0x" + nonce.toString(16),
                to: CONTRACT_ADDRESS,
                data,
                gas: Math.floor(gas * 1.1),
                gasPrice,
            }, privateKey);

            const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
            const currentTokenId = await contract.methods.totalSupply().call();
            setOutput(`Transaction: ${receipt.transactionHash}. Token ID: ${currentTokenId}`);
        } catch (error) {
            console.error(error);
            setOutput(`Error: ${error.message}`);
        }
    };

    const setRentalData = async () => {
        try {
            let _tokenId = Number(tokenId);
            let _expire = new Date(expire).getTime() / 1000;
            let _rewardAmount = Number(rewardAmount);
            const data = contract.methods.setRentalData(renter, _tokenId, _expire, _rewardAmount).encodeABI();

            const gasP = contract.methods.setRentalData(renter, _tokenId, _expire, _rewardAmount).estimateGas();
            const gasPriceP = web3.eth.getGasPrice();
            const [gas, gasPrice] = await Promise.all([gasP, gasPriceP]);
           
            const tx = await web3.eth.accounts.signTransaction({
                to: CONTRACT_ADDRESS,
                data,
                gas: Math.floor(gas * 1.1),
                gasPrice,
            }, privateKey);
           
            const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
            setOutput(`Transaction: ${receipt.transactionHash}`);
        } catch (error) {
            console.error("Error in setRentalData:", error);
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            {/* Owner and Minting Section */}
            <div>
                <input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner address" />
                <input type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder="Private Key" />
                <button onClick={mintToken}>Mint Token</button>
            </div>

            {/* Rental Data Section */}
            <div>
                <input type="text" value={renter} onChange={e => setRenter(e.target.value)} placeholder="Renter address" />
                <input type="text" value={tokenId} onChange={e => setTokenId(e.target.value)} placeholder="Token ID" />
                <input type="text" value={expire} onChange={e => setExpire(e.target.value)} placeholder="Expire date (YYYY-MM-DD)" />
                <input type="text" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} placeholder="Reward Amount" />
                <button onClick={setRentalData}>Set Rental Data</button

        </div>

        <p>Output: {output}</p>
    </div>
);