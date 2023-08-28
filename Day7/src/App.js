import React, { useState } from 'react';
import Web3 from 'web3';
import contractJson from "../build/contracts/LendableSBT.json"; // パスは環境に合わせて適切に修正する必要があります
import './App.css'; // 追加: CSSをインポート

function App() {
    const [web3] = useState(new Web3(process.env.API_URL || "http://127.0.0.1:9545"));  //書き換え必要
    const [contract, setContract] = useState(null);
    const [tokenId, setTokenId] = useState(null);
    const [owner, setOwner] = useState('');
    const [user1, setUser1] = useState('');
    const [user2, setUser2] = useState('');
    const [output, setOutput] = useState('');

    const initializeContract = async () => {
        const _contract = new web3.eth.Contract(contractJson.abi, process.env.CONTRACT_ADDRESS || "0xf17f52151EbEF6C7334FAD080c5704D77216b732"); //書き換え必要
        setContract(_contract);
    };

    const mintToken = async () => {
        try {
            const _tokenId = await contract.methods.mint(user1).send({ from: owner });
            setTokenId(_tokenId);
            setOutput(`Token minted with ID: ${_tokenId}`);
        } catch (err) {
            setOutput(`Error: ${err.message}`);
        }
    };

    const setRentalData = async () => {
        try {
            await contract.methods.setRentalData(user1, tokenId, Date.now() + 100000, 1000).send({ from: owner });
            const rentalData = await contract.methods.getRentalData(user1, tokenId).call();
            setOutput(`Rental data: ${JSON.stringify(rentalData)}`);
        } catch (err) {
            setOutput(`Error: ${err.message}`);
        }
    };

    const rentToken = async (user) => {
        try {
            await contract.methods.rent(tokenId).send({ from: user });
            const rentalData = await contract.methods.getRentalData(user, tokenId).call();
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
