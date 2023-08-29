import React, { useState } from 'react';
import Web3 from 'web3';
import './App.css';
const contractJson = require("./LendableSBT.json");
const web3 = new Web3("http://127.0.0.1:9545");
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xC98031d7f50b9d2291E9adf305c00652CB2c874a";//YOU HAVE TO CHECK
const contract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
    from: "0x2f6d487de1705340ef0b05ba416c9c7c89408549",
  });

function App() {
    const [tokenId, setTokenId] = useState(null);
    const [owner, setOwner] = useState("0x2f6d487de1705340ef0b05ba416c9c7c89408549");
    const [renter, setRenter] = useState();
    const [privateKey, setPrivateKey] = useState("681dc3f4126d2e935a99b101deae80b8ade75fe06f6647f304ab4cd5026ad5b0");
    const [output, setOutput] = useState();


    const mintToken = async () => {
            console.log(privateKey);
            let nonce = await web3.eth.getTransactionCount(owner,'latest');
            nonce = "0x"+ nonce.toString(16);
            console.log(nonce)
            const data = contract.methods.mint(owner).encodeABI();
            let gas = await contract.methods.mint(owner).estimateGas();
            const gasPrice = await web3.eth.getGasPrice();
            gas = Number(gas);
            const tx = await web3.eth.accounts.signTransaction(
                {
                    nonce,
                    to: CONTRACT_ADDRESS,
                    data,
                    gas: Math.floor(gas * 1.1),
                    gasPrice,
                },
                privateKey
            );
            const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
            const tokenId = await contract.method.totalSupply().call();
            setOutput ('Transaction: ${receipt.transactionHash}. tokenId: ${tokenId}');
        };


    return (
        <div>
           {/* // <button onClick={initializeContract}>Initialize Contract</button> */}
           
            <div>
                <input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner address" />
                <input type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder="Private Key" />
                <button onClick={mintToken}>Mint Token</button>
            </div>

            <div>
                <input type="text" value={renter} onChange={e => setRenter(e.target.value)} placeholder="Renter address" />

            </div>

            <p>Output: {output}</p>
        </div>
    );
}

export default App;