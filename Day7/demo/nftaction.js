const Web3 = require("web3");

// Configurations
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "81859857a769d3d97d88cb952764b49ff6ed9a845bf75d4340ae83b68f45d960";
const API_URL = process.env.API_URL || "http://127.0.0.1:9545";
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS || "0x5459c2182257b6a24427ec1916728233e5e54576"; 
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
const CONTRACT_PATH =
  process.env.CONTRACT_PATH || "../build/contracts/LendableSBT.json";
const contractJson = require(CONTRACT_PATH);

const web3 = new Web3(API_URL);
const nftContract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
  from: WALLET_ADDRESS,
});

async function mint() {
    const useraddress = await nftContract.methods.mint(WALLET_ADDRESS).call();
    console.log(useraddress);
    const data = nftContract.methods.mint(WALLET_ADDRESS).encodeABI();
  
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
    console.log(receipt);
  }

  async function rent(tokenId) {
    tokenId = Number(tokenId);
    console.log(tokenId);
    const useraddress = await nftContract.methods.rent(tokenId).call();
    const data = nftContract.methods.rent(tokenId).encodeABI();
  
    const gasP = nftContract.methods.rent(tokenId).estimateGas();
    const gasPriceP = web3.eth.getGasPrice();
    const [gas, gasPrice] = await Promise.all([gasP, gasPriceP]);
  
    const tx = await web3.eth.accounts.signTransaction(
      {
        to: CONTRACT_ADDRESS,
        data,
        gas: Math.floor(gas * 1.5),
        gasPrice,
      },
      PRIVATE_KEY
    );
  
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(receipt);
  }
  

exports.getRentalData = async (renter, tokenId) => {
  tokenId = Number(tokenId);
  return await nftContract.methods.getRentalData(renter, tokenId).call();
}

exports.isTokenExpiredCheck = async (renter, tokenId) => {
  tokenId = Number(tokenId);
  return await nftContract.methods.isTokenExpiredCheck(renter, tokenId).call();
}

exports.isRentedCheck = async (renter, tokenId) => {
  tokenId = Number(tokenId);
  return await nftContract.methods.isRentedCheck(renter, tokenId).call();
}

exports.setBaseURI = async (address) => {
  // ...(略) セットとトランザクションの署名、送信のロジック...
}

exports.setRentalData = async (renter, tokenId, expire, rewardAmount) => {
  // ...(略) セットとトランザクションの署名、送信のロジック...
}

exports.tokenURI = async (tokenId) => {
  return await nftContract.methods.tokenURI(tokenId).call();
}

// CLI interface
async function nftActions(action, ...args) {
  switch (action) {
    case "mint":
      await mint();
      break;
    case "rent":
      await rent(args[0]);
      break;
    case "getRentalData":
      console.log(await exports.getRentalData(args[0], args[1]));
      break;
    case "isTokenExpiredCheck":
      console.log(await exports.isTokenExpiredCheck(args[0], args[1]));
      break;
    case "isRentedCheck":
      console.log(await exports.isRentedCheck(args[0], args[1]));
      break;
    case "tokenURI":
      console.log(await exports.tokenURI(args[0]));
      break;
    default:
      console.log("Invalid action or parameters.");
  }
}

if (require.main === module) {
  nftActions(process.argv[2], ...process.argv.slice(3));
}

//node nftActions.js mint
//node nftActions.js rent <tokenId>
//node nftActions.js rent 5
//node nftActions.js getRentalData <renter> <tokenId>
//node nftActions.js isTokenExpiredCheck <renter> <tokenId>
//node nftActions.js isTokenExpiredCheck <renter> <tokenId>
//node nftActions.js tokenURI <tokenId>
