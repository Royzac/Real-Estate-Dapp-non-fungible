### Deployed on Ropsten Testnet, address: 0x8D692A4866537618f51587C3530fBc0a50971799

# PROBLEM and SOLUTION:

Real estate transaction are heavily dependent upon opaque legacy processes that expose the transaction to more risk and reduce expendiancy.
The solution is to provide a disintermidiate process where all terms can be fulfilled throught the blockchain.

I had originally considered a real estate defi application(see below), but after further consideration realized that each loan is dependent upon 
both a signed contract, and a deed for collateral or to place a lien upon. This is critical and helps to reduce substantial risk for lenders. I think this a perequisite to allowing real estate defi to undercut prevailing interest rates in conjunction with a fractional lending system.



## DESIGN PATTERNS:

### Inheritance(ownable).
### Gas optimization through lower uint size and use of calldata over in-memory where appropiate


## SECURTIY MEASURES:

### Access control design patterns using modifier and require functions
### Tx.Origin transaction authentication


## INSTRUCTIONS TO SET-UP:

#### Latest Nodejs must be installed
#### Once this repo is cloned, enter the following lines in the top-level directory.
#### truffle test to run tests on the smart contract, and npm start to run the frontend application.

``` 
npm install

truffle migrate

truffle test

npm start

```
