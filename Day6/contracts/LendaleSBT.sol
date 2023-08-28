// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ERC5192} from "./ERC5192.sol";

contract LendableSBT is ERC5192,Ownable {
    
    struct UserInfo {
        uint256 expire;
        bool isRented;
        uint rewardAmount;
    }

    struct RentalData {
        mapping(address => UserInfo) users;
    }

    mapping(uint256 => RentalData) tokenRentalData;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    bool private isLocked = true;//譲渡不可な環境状態であればTrue、可能な状態であればFalse
    string private _currentBaseURI;
    

    constructor(string memory name_, string memory symbol_, bool _isLocked)

     ERC5192(name_, symbol_, _isLocked)
    {
        isLocked = _isLocked;
        _currentBaseURI =  "https://lendableSBT/example/"; // Default
    }

    //Folloing function
    function _baseURI() internal view virtual override returns (string memory) {
        return _currentBaseURI;
    }
    // 任意のURIを設定する。
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _currentBaseURI = newBaseURI;
    }

    function mint(
        address to
        ) public onlyOwner returns (uint256) {
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);
        if (isLocked) emit Locked(newTokenId);
        return newTokenId;
    }

    function setRentalData(
        address renter,
        uint256 tokenId,
        uint256 expire,
        uint rewardAmount
    ) public onlyOwner {
        tokenRentalData[tokenId].users[renter].expire = expire;
        tokenRentalData[tokenId].users[renter].isRented = false;
        tokenRentalData[tokenId].users[renter].rewardAmount = rewardAmount;
    }
   
    function rent(uint256 tokenId) public{
      require(
            tokenRentalData[tokenId].users[msg.sender].expire >= block.timestamp,
            "Token is not available for rent"
        );
        require(
            tokenRentalData[tokenId].users[msg.sender].isRented == false,
            "Token is already rented"
        );
        //payable(ownerOf(tokenId)).transfer(tokenRentalData[tokenId].users[msg.sender].rewardAmount);
        // トークンのレンタル状態を更新
        tokenRentalData[tokenId].users[msg.sender].isRented = true;
        
    }

    function getRentalData(
        address renter,
        uint256 tokenId
    ) public view returns (UserInfo memory) {
        return tokenRentalData[tokenId].users[renter];
    }
    // トークンの有効期限切れをチェック
   function isTokenExpiredCheck(address renter ,uint256 tokenId ) public view returns (bool) {
       return tokenRentalData[tokenId].users[renter].expire>=block.timestamp;
   }
     // トークンのレンタル状態をチェック
    function isRentedCheck(address renter,uint256 tokenId) public view returns (bool) {
       return tokenRentalData[tokenId].users[renter].isRented;
   }
}
