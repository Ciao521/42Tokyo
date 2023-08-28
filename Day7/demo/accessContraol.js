const Web3 = require("web3");

const CONFIG = {
    PRIVATE_KEY: process.env.PRIVATE_KEY || "b1b62410ca504caeb055893c2e409d313a58cbfdf4f177837f349dec2ee6e22e",
    API_URL: process.env.API_URL || "http://127.0.0.1:9545",
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || "0x8b707a3283db61fab6b1c4922b5574befd23a654",
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || "0xE21c9c6964ded1F7bA6150E9ceeE4045b7C28609",
    CONTRACT_PATH: process.env.CONTRACT_PATH || "../build/contracts/LendableSBT.json"
};

const contractJson = require(CONFIG.CONTRACT_PATH);
const web3 = new Web3(CONFIG.API_URL);
const nftContract = new web3.eth.Contract(contractJson.abi, CONFIG.CONTRACT_ADDRESS, {
    from: CONFIG.WALLET_ADDRESS,
});

async function accessControl(renter, tokenId) {
    const data = JSON.stringify({ token: tokenId });
    const signature = web3.eth.accounts.sign(data, CONFIG.PRIVATE_KEY).signature;

    const recoveredAddress = await web3.eth.accounts.recover(data, signature);
    
    const owner = await nftContract.methods.ownerOf(tokenId).call();
    const isTokenExpired = await nftContract.methods.isTokenExpiredCheck(renter, tokenId).call();
    const isRented = await nftContract.methods.isRented(renter, tokenId).call();

    if (recoveredAddress === owner || (isTokenExpired && isRented)) {
        console.log("Access granted");
    } else {
        console.log("Access denied");
    }
}

if (require.main === module) {
    const renter = process.argv[2];
    const tokenId = process.argv[3];

    if (!renter || !tokenId) {
        console.error("Please provide both renter address and tokenId as arguments.");
        process.exit(1);
    }

    accessControl(renter, tokenId).catch(error => {
        console.error("Error:", error.message);
    });
}
