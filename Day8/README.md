# lendableSBT_DEMO
### account

(0) 0x5459c2182257b6a24427ec1916728233e5e54576

(1) 0xc3de40cdbf4995332f406bf9fef28f751f4fdcc5

(2) 0xe25ef5735342f1071294463925dfb91be9cc2153

### Private Keys:
(0)81859857a769d3d97d88cb952764b49ff6ed9a845bf75d4340ae83b68f45d960

(1)3af3ed8d79c30217702d288797e79d54b1fed636c4080a3283a73f63c47eb085

(2)152bdc3948debf653f458b00edef83e3a88c6542e947b14a4a12785492a7339e

# How to test
##  1. BaseURIの設定
### 実行例:
~~~
node nftactions.js baseURI "https://example.com/nft/"
~~~
### 実行結果:
このコマンドは、NFTのBaseURIを指定したURIに変更します。実際の結果としては、トランザクションの受領がコンソールに表示されます。
~~~
Transaction receipt: node nftactions.js baseURI "https://lendableSBT/example/1"
~~~
## 2. Tokenの発行 (Mint)
### 実行例:
~~~
node nftactions.js mint
~~~
### 実行結果:
新しいNFTトークンが発行されます。結果として、新しく発行されたトークンのIDが表示されるはずです。
~~~
mint tokenId: [新しいトークンID]
~~~
## 3. 貸し出し設定
### 実行例:
~~~
node nftactions.js set 0xc3de40cdbf4995332f406bf9fef28f751f4fdcc5 1 "2023-12-31" 100
~~~
## 4. トークンを借りる
### 実行例:
~~~
node nftactions.js rent 1
~~~
## 5. トークンのURI取得
### 実行例:
~~~
node nftactions.js tokenURI 1
~~~
### 実行結果:
トークンID 1 のURIが取得され、表示されます。
~~~
Token URI: https://example.com/nft/1
~~~
## 6. 貸し出し情報の取得
### 実行例:
~~~
node nftactions.js get 0xc3de40cdbf4995332f406bf9fef28f751f4fdcc5 1
~~~
## 7. トークンの有効期限チェック

### 実行例:
~~~
node nftactions.js check 0xc3de40cdbf4995332f406bf9fef28f751f4fdcc5 1
~~~
### 予想される結果:
トークンID `1` の有効期限がチェックされ、結果が表示されます。
~~~
Token Expiry: [true or false]
~~~

## 8. トークンが貸し出されているかチェック

### 実行例:
~~~
node nftactions.js isRentedCheck 0xc3de40cdbf4995332f406bf9fef28f751f4fdcc5 1
~~~
### 予想される結果:
トークンID `1` が貸し出されているかどうかがチェックされ、結果が表示されます。
~~~
Is Rented: [true or false]
~~~

## 9. アクセス制御チェック

### 実行例:
~~~
node nftactions.js access 1
~~~
### 予想される結果:
トークンID `1` のアクセス権限がチェックされ、結果が表示されます。
~~~
Access granted
~~~
または、
~~~
Access denied
~~~