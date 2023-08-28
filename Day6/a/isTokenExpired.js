const Web3 = require("web3");

const API_URL = process.env.API_URL || "http://127.0.0.1:9545";
const WALLET_ADDRESS =
  process.env.WALLET_ADDRESS || "0xbe0f2b693387b5afc846dfa1aaa2f280c2d85f01";//Accounts(0)の値
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xe3C06523BFD8B41CC26BA2ED16A81c600473f900";//Account Adress
const CONTRACT_PATH =
  process.env.CONTRACT_PATH || "../build/contracts/LendableSBT.json";
const contractJson = require(CONTRACT_PATH);

const web3 = new Web3(API_URL);
const nftContract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS, {
  from: WALLET_ADDRESS,
});
  
async function isTokenExpiredCheck() {
    // 特定のNFTの「user」のアドレスを取得する関数。
    // tokenId` user情報を取得するNFTのトークンID。
    // 戻り値 NFTの「user」のアドレスを示します。0アドレスの場合、「使用する」アドレスが存在しないことを示す。
    let renter = process.argv[2];
    let  tokenId = process.argv[3];
  
  tokenId = Number(tokenId);
  
  let isTokenExpired= await nftContract.methods.isTokenExpiredCheck(renter,tokenId).call();
  console.log(isTokenExpired);
}

async function isRentedCheck() {
  // 特定のNFTの「user」のアドレスを取得する関数。
  // tokenId` user情報を取得するNFTのトークンID。
  // 戻り値 NFTの「user」のアドレスを示します。0アドレスの場合、「使用する」アドレスが存在しないことを示す。
  let renter = process[2];
  let  tokenId = process.argv[3];
tokenId = Number(tokenId);
let isTokenExpired= await nftContract.methods.isRentedCheck(renter,tokenId).call();
console.log(isTokenExpired);
}
isTokenExpiredCheck();
isRentedCheck();