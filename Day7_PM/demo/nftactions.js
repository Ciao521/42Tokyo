const Web3 = require("web3");

// Configurations
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "681dc3f4126d2e935a99b101deae80b8ade75fe06f6647f304ab4cd5026ad5b0";//owner
  const PRIVATE_KEY2 =
  process.env.PRIVATE_KEY2 || "312d97f3e64bc0750793c814046f838dcff0c3fcee91e6083f4d1056b41b79ef";//renter
const API_URL = process.env.API_URL || "http://127.0.0.1:9545";
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS || "0x2f6d487de1705340ef0b05ba416c9c7c89408549"; //owner
const WALLET_ADDRESS2 =
  process.env.WALLET_ADDRESS2 || "0xbe0f2b693387b5afc846dfa1aaa2f280c2d85f01";//renter
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xC98031d7f50b9d2291E9adf305c00652CB2c874a";//YOU HAVE TO CHECK
const CONTRACT_PATH =
  process.env.CONTRACT_PATH || "../build/contracts/LendableSBT.json";
const contractJson = require(CONTRACT_PATH);

const web3 = new Web3(API_URL);
const nftContract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
  from: WALLET_ADDRESS,
});
const nftContract2 = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
  from: WALLET_ADDRESS2,
});

  async function setBaseURI(address) {
    const data = nftContract.methods.setBaseURI(address).encodeABI();
    console.log(data);
    // transaction に用いるために予想される gas と gasPrice を取得
    const gasP = nftContract.methods.setBaseURI(address).estimateGas();
    const gasPriceP = web3.eth.getGasPrice();
    const [gas, gasPrice] = await Promise.all([gasP, gasPriceP]);

    // transaction への署名を行う
    const tx = await web3.eth.accounts.signTransaction(
    {
        to: CONTRACT_ADDRESS,
        data,
        gas:Math.floor(gas*1.5),
        gasPrice,
    },
    PRIVATE_KEY
    );

    // 署名済みの transaction を送信
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(receipt);
  }
//Tokenの発行機能
  async function mint() {
    const useraddress = await nftContract.methods.mint(WALLET_ADDRESS).call();
    console.log("mint tokenId:"+useraddress);
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
  }
//貸し出し
  async function setRentalData(renter,tokenId,expire,rewardAmount){
    tokenId = Number(tokenId);
    expire = new Date(expire);
    expire = expire.getTime();
    expire = expire/1000;
    rewardAmount = Number(rewardAmount);
    //let useraddress = await nftContract.methods.setRentalData(renter,tokenId,expire,rewardAmount).call();
    //console.log(useraddress,tokenId,expire,rewardAmount); 
    const data = nftContract.methods.setRentalData(renter,tokenId,expire,rewardAmount).encodeABI();
    
    // transaction に用いるために予想される gas と gasPrice を取得
    const gasP = nftContract.methods.setRentalData(renter,tokenId,expire,rewardAmount).estimateGas();
    const gasPriceP = web3.eth.getGasPrice();
    const [gas, gasPrice] = await Promise.all([gasP, gasPriceP]);
    // transaction への署名を行う
    const tx = await web3.eth.accounts.signTransaction(
    {
        to: CONTRACT_ADDRESS,
        data,
        gas:Math.floor(gas*1.1),
        gasPrice,
    },
    PRIVATE_KEY
    );

    // 署名済みの transaction を送信
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(receipt);
  }
//T借りる
  async function rent(tokenId) {
  // const address = await nftContract2.methods.rent(tokenId).call();
  // console.log(data);

  const data = nftContract2.methods.rent(tokenId).encodeABI(); 
  console.log(data);
  const gasP = nftContract2.methods.rent(tokenId).estimateGas();
  const gasPriceP = web3.eth.getGasPrice();
  const [gas, gasPrice] = await Promise.all([gasP, gasPriceP]);

  const tx = await web3.eth.accounts.signTransaction(
    {
      to: CONTRACT_ADDRESS,
      data,
      gas: Math.floor(gas*1.5),
      gasPrice,
    },
    PRIVATE_KEY2
  );

  const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
  console.log(receipt);
  }
  
exports.tokenURI = async (tokenId) => {
  return await nftContract.methods.tokenURI(tokenId).call();
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


// CLI interface
async function nftActions(action, ...args) {
  switch (action) {    
    case "baseURI":
      await setBaseURI(args[0]);
      break;
    case "mint":
      await mint();
      break;
    case "set":
        await setRentalData(args[0],args[1],args[2],args[3]);
        break;
    case "rent":
      await rent(args[0]);
      break;    

    case "tokenURI":
      console.log(await exports.tokenURI(args[0]));
      break;
    default:
      console.log("Invalid action or parameters.");
    case "get":
      console.log(await exports.getRentalData(args[0], args[1]));
      break;
    case "check":
      console.log(await exports.isTokenExpiredCheck(args[0], args[1]));
      break;
    case "isRentedCheck":
      console.log(await exports.isRentedCheck(args[0], args[1]));
      break;
  }
}

if (require.main === module) {
  nftActions(process.argv[2], ...process.argv.slice(3));
}

//node nftactions.js baseURI <BASE URI>
//node nftactions.js mint
//node nftaction.hs set <renter> <tokenId> <expiredtime> <reward Amount>
//node nftactions.js rent <tokenId>
//node nftactions.js rent 5
//node nftactions.js get <renter> <tokenId>
//node nftactions.js check <renter> <tokenId>
//node nftactions.js isRentedCheck <renter> <tokenId>
//node nftactions.js tokenURI <tokenId>