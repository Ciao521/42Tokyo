import React, { useState } from 'react';
import Web3 from 'web3';
import './App.css'; // 追加: CSSをインポート
const contractJson = require("./LendableSBT.json");
function App() {
    const [web3] = useState(new Web3(process.env.API_URL || "http://127.0.0.1:9545"));  //書き換え必要
    const [contract, setContract] = useState(null);
    const [tokenId, setTokenId] = useState(null);
    const [owner, setOwner] = useState('');
    const [user1, setUser1] = useState('');
    const [user2, setUser2] = useState('');
    const [output, setOutput] = useState('');


//     const PRIVATE_KEY =
//     process.env.PRIVATE_KEY ||
//     "681dc3f4126d2e935a99b101deae80b8ade75fe06f6647f304ab4cd5026ad5b0";//owner
//     const PRIVATE_KEY2 =
//     process.env.PRIVATE_KEY2 || "312d97f3e64bc0750793c814046f838dcff0c3fcee91e6083f4d1056b41b79ef";//renter
//   const API_URL = process.env.API_URL || "http://127.0.0.1:9545";
//   const WALLET_ADDRESS =
//     process.env.WALLET_ADDRESS || "0x2f6d487de1705340ef0b05ba416c9c7c89408549"; //owner
//   const WALLET_ADDRESS2 =
//     process.env.WALLET_ADDRESS2 || "0xbe0f2b693387b5afc846dfa1aaa2f280c2d85f01";//renter
//   const CONTRACT_ADDRESS =
//     process.env.CONTRACT_ADDRESS || "0xC98031d7f50b9d2291E9adf305c00652CB2c874a";//YOU HAVE TO CHECK
//   const CONTRACT_PATH =
//     process.env.CONTRACT_PATH || "../build/contracts/LendableSBT.json";
  
const initializeContract = async () => {
        const _contract = new web3.eth.Contract(contractJson.abi, process.env.CONTRACT_ADDRESS || "0x21F1Ae4E79591AF11E8e66049bEcc5cbFd6e77a5"); //書き換え必要
        setContract(_contract);
    };
      const nftContract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
    from: WALLET_ADDRESS,
    });


    
    const mintToken = async () => {
        try {
            const data = contractJson.methods.mint(WALLET_ADDRESS).encodeABI();
  
            const gasP = nftContract.methods.mint(WALLET_ADDRESS).estimateGas();
            const gasPriceP = web3.eth.getGasPrice();
            const [gas, gasPrice] = await Promise.all([gasP, gasPriceP]);
          
            const tx = await web3.eth.accounts.signTransaction(
              {
                to: CONTRACT_ADDRESS,
                data,
                gas: Math.floor(gas * 1.1),
                gasPrice,
              },
              PRIVATE_KEY
            );
          
            const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
        } catch (err) {
            setOutput(`Error: ${err.message}`);
        }
    };

    const setRentalData = async () => {
        try {
            await nftContract.methods.setRentalData(user1, tokenId, Date.now() + 100000, 1000).send({ from: owner });
            const rentalData = await nftContract.methods.getRentalData(user1, tokenId).call();
            setOutput(`Rental data: ${JSON.stringify(rentalData)}`);
        } catch (err) {
            setOutput(`Error: ${err.message}`);
        }
    };

    const rentToken = async (user) => {
        try {
            await nftContract.methods.rent(tokenId).send({ from: user });
            const rentalData = await nftContract.methods.getRentalData(user, tokenId).call();
            setOutput(`Rental data after rent: ${JSON.stringify(rentalData)}`);
        } catch (err) {
            setOutput(`Error: ${err.message}`);
        }
    };


    return (
        <div>
            <button onClick={initializeContract}>Initialize Contract</button>
            
            <div>
                <input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner address" />
                <button onClick={mintToken}>Mint Token</button>
            </div>

            <div>
                <input type="text" value={user1} onChange={e => setUser1(e.target.value)} placeholder="User1 address" />
                <button onClick={() => setRentalData()}>Set Rental Data for User1</button>
                <button className="secondary" onClick={() => rentToken(user1)}>Rent Token as User1</button> {/* クラス追加 */}
            </div>

            <div>
                <input type="text" value={user2} onChange={e => setUser2(e.target.value)} placeholder="User2 address" />
                <button className="secondary" onClick={() => rentToken(user2)}>Rent Token as User2</button> {/* クラス追加 */}
            </div>

            <p>Output: {output}</p>
        </div>
    );
}

export default App;