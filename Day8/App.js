import React, { useState } from 'react';
import Web3 from 'web3';
import './App.css';
const contractJson = require("./LendableSBT.json");
const web3 = new Web3("http://127.0.0.1:9545");
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xed461E20CABa4e1f9B48A41E9b953F51DbE5e638";//YOU HAVE TO CHECK
const contract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
    from: "0x5459c2182257b6a24427ec1916728233e5e54576",
  });

function App() {
    // States
    //owner,renter.access address
    const [owner, setOwner] = useState("0x5459c2182257b6a24427ec1916728233e5e54576");
    const [renter, setRenter] = useState("0xc3de40cdbf4995332f406bf9fef28f751f4fdcc");
    const [access, setAccess] = useState("0xe25ef5735342f1071294463925dfb91be9cc2153");
    //owner,renter.access privatekey
    const [privateKey, setPrivateKey] = useState("81859857a769d3d97d88cb952764b49ff6ed9a845bf75d4340ae83b68f45d960");
    const [privateKey2, setPrivateKey2] = useState("3af3ed8d79c30217702d288797e79d54b1fed636c4080a3283a73f63c47eb085");
    const [privateKey3, setPrivateKey3] = useState("152bdc3948debf653f458b00edef83e3a88c6542e947b14a4a12785492a7339e");
    
    const [output, setOutput] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [expire, setExpire] = useState("");
    const [rewardAmount, setRewardAmount] = useState("");
    const [tokenURIResult, setTokenURIResult] = useState("");


    const mintToken = async () => {
        let currentTokenId = await contract.methods.mint(owner).call();
        let nonce = await web3.eth.getTransactionCount(owner, 'latest');
        const data = contract.methods.mint(owner).encodeABI();
        let gas = await contract.methods.mint(owner).estimateGas();
        const gasPrice = await web3.eth.getGasPrice();
        gas = Number(gas);
        const tx = await web3.eth.accounts.signTransaction({
            nonce: "0x" + nonce.toString(16),
            to: CONTRACT_ADDRESS,
            data,
            gas: Math.floor(gas * 1.1),
            gasPrice,
        }, privateKey);

        let receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
        setOutput(`Transaction: ${receipt.transactionHash}. Token ID: ${currentTokenId}`);
    };


    const setRentalData = async () => {
        let nonce = await web3.eth.getTransactionCount(owner, 'latest');
        let _tokenId = Number(tokenId);
        let _expire = new Date(expire).getTime() / 1000;
        let _rewardAmount = Number(rewardAmount);
    
        const data = contract.methods.setRentalData(renter, _tokenId, _expire, _rewardAmount).encodeABI();
        let gas = await contract.methods.setRentalData(renter, _tokenId, _expire, _rewardAmount).estimateGas();
        const gasPrice = await web3.eth.getGasPrice();
        gas = Number(gas);
    
        const tx = await web3.eth.accounts.signTransaction({
            nonce: "0x" + nonce.toString(16),
            to: CONTRACT_ADDRESS,
            data,
            gas: Math.floor(gas * 1.1),
            gasPrice,
        }, privateKey);
        
        const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
        setOutput(`Transaction: ${receipt.transactionHash}`);
    };
    

        const tokenURI = async (tokenId) => {
            const uri = await contract.methods.tokenURI(tokenId).call();
            setTokenURIResult(uri);
        };
        
        const getRentalData = async (renter, tokenId) => {
            tokenId = Number(tokenId);
            const rentalData = await contract.methods.getRentalData(renter, tokenId).call();
            console.log(rentalData);
        };
        
        const isTokenExpiredCheck = async (renter, tokenId) => {
            tokenId = Number(tokenId);
            return await contract.methods.isTokenExpiredCheck(renter, tokenId).call();
        };
        
        const isRentedCheck = async (renter, tokenId) => {
            tokenId = Number(tokenId);
            return await contract.methods.isRentedCheck(renter, tokenId).call();
        };
        
        const accessControll = async (tokenId) => {
            const data = JSON.stringify({ token: tokenId });
            const signed = await web3.eth.accounts.sign(data, privateKey3);
            const signature = signed.signature;
            
            const requestBody = {
                data: data,
                signature: signature,
            };
        
            const recoveredAddress = await web3.eth.accounts.recover(
                requestBody.data,
                requestBody.signature
            );
        
            const owner = await contract.methods.ownerOf(tokenId).call();
        
            let isTokenExpired = await isTokenExpiredCheck(access, tokenId);
            let isRented = await isRentedCheck(access, tokenId);
        
            if (recoveredAddress === owner) {
                console.log("Access granted");
            } else if(isTokenExpired && isRented){
                console.log("Access granted");
            } else {
                console.log("Access denied");
            }
        }
        
    return (
        <div>
            {/* Owner and Minting Section */}
            <div>
                <input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner address" />
                <input type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder="Owner's Private Key" />
                <button onClick={mintToken}>Mint Token</button>
            </div>

            {/* Rental Data Section */}
            <div>
                <input type="text" value={renter} onChange={e => setRenter(e.target.value)} placeholder="Renter address" />
                <input type="text" value={tokenId} onChange={e => setTokenId(e.target.value)} placeholder="Token ID" />
                <input type="text" value={expire} onChange={e => setExpire(e.target.value)} placeholder="Expire date (YYYY-MM-DD)" />
                <input type="text" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} placeholder="Reward Amount" />
                <button onClick={setRentalData}>Set Rental Data</button>
            </div>
            <div>
            <input type="text" value={tokenId} onChange={e => setTokenId(e.target.value)} placeholder="Token ID for URI" />
            <button onClick={() => tokenURI(tokenId)}>Fetch Token URI</button>
            <p>Token URI: {tokenURIResult}</p>
            <button onClick={() => getRentalData(renter, tokenId)}>Get Rental Data</button>
            <input type="text" value={access} onChange={e => setAccess(e.target.value)} placeholder="Set Access" />
            <button onClick={() => accessControll(tokenId)}>Access Control Check</button>
        </div>
            <p>Output: {output}</p>
        </div>
    );
}
export default App;