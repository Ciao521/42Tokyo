
const Web3 = require("web3");

const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "81859857a769d3d97d88cb952764b49ff6ed9a845bf75d4340ae83b68f45d960";
const API_URL = process.env.API_URL || "http://127.0.0.1:9545";
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS || "0x5459c2182257b6a24427ec1916728233e5e54576";//Accounts(0)の値
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xf17f52151EbEF6C7334FAD080c5704D77216b732";//CONTRACT Adress
const CONTRACT_PATH =
  process.env.CONTRACT_PATH || "../build/contracts/LendableSBT.json";
const contractJson = require(CONTRACT_PATH);



const web3 = new Web3(API_URL);
const nftContract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
  from: WALLET_ADDRESS,
});
  
async function setRentalData() {
    // 特定のNFTの「user」のアドレスを取得する関数。
    // tokenId` user情報を取得するNFTのトークンID。
    // 戻り値 NFTの「user」のアドレスを示します。0アドレスの場合、「使用する」アドレスが存在しないことを示す。
  let renter = process.argv[2];
  let tokenId = process.argv[3];
  let expire = process.argv[4];
  let rewardAmount = process.argv[5];

  tokenId = Number(tokenId);
  expire = new Date(expire);
  expire = expire.getTime();
  rewardAmount = Number(rewardAmount);
  
  let useraddress = await nftContract.methods.setRentalData(renter,tokenId,expire,rewardAmount).call();
  console.log(useraddress,tokenId,expire,rewardAmount); 
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

setRentalData();