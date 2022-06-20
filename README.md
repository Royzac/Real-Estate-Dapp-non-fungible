### ADDRESSES

Ropsten Contract Address: 0x8D692A4866537618f51587C3530fBc0a50971799 

Frontend URL:https://blockchain-developer-bootcamp-final-project-pvapoi8u8-royzac.vercel.app/

My Account Address: 0x099b6EDe4689Ea0f6DAc5126BD96bbbC719a9389

# VIDEO TOUR

Video Tour: https://www.loom.com/share/9d43280e83c9466fb28a4e00f0515bb4

# PROBLEM and SOLUTION:

Real estate transaction are heavily dependent upon opaque legacy processes that expose the transaction to more risk and reduce expendiency.
The solution is to provide a disintermidiate process where all terms can be fulfilled through the smart contract.

I had originally considered a real estate defi application for real estate loans, but after further consideration realized that each loan is dependent upon both a signed contract, and a deed for collateral. This is critical and helps to reduce substantial risk for lenders. I believe this is a perequisite to allowing real estate defi to undercut prevailing interest rates in conjunction with a fractional lending system.


## DIRECTORY STRUCTURE

Root directory consists of all major directories(such as Test and Src) 
and config files like truffle-config.js

Src folder includes relevant abis,components, and contracts

```bash
.
├── README.md
├── Testnet_abis
│   ├── Context.json
│   ├── Migrations.json
│   ├── Ownable.json
│   └── realEstateTransaction.json
├── build
│   └── contracts
├── deployed_address.txt
├── direct_tree.txt
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_realEstateTransaction.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── abis
│   ├── components
│   ├── contracts
│   ├── index.js
│   └── logo.png
├── test
│   └── test_realEstateTransaction.js
└── truffle-config.js
```

10 directories, 21 files



## DESIGN PATTERNS:

#### Inheritance(ownable).
#### Gas optimization through lower uint size and use of calldata over in-memory where appropiate




## SECURTIY MEASURES:

#### Access control design patterns using modifier and require functions
#### Tx.Origin transaction authentication




## INSTRUCTIONS TO SET-UP:


#### Latest Nodejs must be installed
#### Once this repo is cloned, enter the following lines in the top-level/root directory.
#### truffle test to run tests on the smart contract, and npm start to run the frontend application.

``` 
npm install

npm install ganache-cli

truffle migrate --reset

truffle test

npm start

```



### Additional Items to Work On
##### Upgrade Contract to ERC721

##### Provide Conversion Ratio to Transaction using an exchange API

##### Upgrade Frontend Interface with Inventory of properties for sale


##### Maybe create Auction system?

##### Redesign Ownership/Mint Authentication Process. Perhaps consider Oracle use for validation.

##### Add comments throughout contract

##### Extend testing

