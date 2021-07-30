# CryptoCount_API

## Start

>> cd backend

>> node main 3001

## Valid Endpoints

### Automatic Delegator Address Fiat Book Value Analysis 

>> localhost:3001/Analysis/Auto

#### Query Parameters

>>?address=${address}&fiat=${fiat}

*where fiat is the three letter representation of your country's fiat

### Automatic Delegator Address Analysis While Realizing A Quantity Of XTZ 

>> localhost:3001/Analysis/AutoRealizing

#### Query Parameters

>>?address=${address}&fiat=${fiat}&quantityRealizing=${quantityRealizing}






