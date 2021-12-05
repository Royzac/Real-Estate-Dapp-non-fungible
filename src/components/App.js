import { Tabs, Tab } from 'react-bootstrap'
import realEstateTransaction from '../abis/realEstateTransaction.json'
import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      contract: null,
      balance: 0,
      addressName: ''
    }
    this.mintProperty = this.mintProperty.bind(this)
    this.listPropertyForSale = this.listPropertyForSale.bind(this)
    this.buyProperty = this.buyProperty.bind(this)

  }  


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.detectAccountChange()
  }

  async loadWeb3() {
    // Ensure Wallet is awailable
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const netId = await web3.eth.net.getId()
    
    // connect to contract
    try {
      const reTransaction = new web3.eth.Contract(realEstateTransaction.abi, realEstateTransaction.networks[netId].address)
      this.setState({contract: reTransaction})
    } catch (e) {
      console.log('Error', e)
      window.alert('Contract not detected on the network')

    }

    // Load wallet account data
    const accounts = await web3.eth.getAccounts()
    if(typeof accounts[0] !=='undefined'){
      const balance = await web3.eth.getBalance(accounts[0])
      this.setState({account: accounts[0], balance: balance, web3: web3})
    } else {
      await window.ethereum.enable()
      window.location.reload()

  }

  }
 
  detectAccountChange() {
    const ethereum = window.ethereum
    
    if(ethereum) {
      ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
      })

      ethereum.on('chainChanged', () => {
        window.location.reload()

      })
    }
  }



  async mintProperty(_address) {
    if(this.state.contract){
      try{
        await this.state.contract.methods.mintProperty(_address).send({ from: this.state.account }).once('confirmation', (confirmation) => {
        window.alert('Transaction successful.')
        this.setState({addressName: _address})
        })
      } catch (e) {
        console.log('Error, issue minting: ', e)
      }
    }
  }

  async listPropertyForSale(_address,price) {
    if(this.state.contract){
      try{
        await this.state.contract.methods.listPropertyForSale(_address,price).send({ from: this.state.account}).once('confirmation', (confirmation) => {
        window.alert('Your property has been listed for sale.')
       })
      } catch (e) {
        console.log('Error, listing property for sale: ', e)
      }
    }
  }

  async buyProperty(_address,price) {
    if(this.state.contract){
      try{
        await this.state.contract.methods.buyProperty(_address).send({ from: this.state.account}).once('confirmation', (confirmation) => {
        window.alert(`You have purchased ${_address}`)
        })
      } catch (e) {
        console.log('Error, buying property for sale: ', e)
      }
    }
  }
     

  
    render() {
      return (
        <div className='text-monospace'>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href="https://github.com/Royzac/blockchain-developer-bootcamp-final-project"
              target="_blank"
              rel="noopener noreferrer"
            >
          <img src={logo} className="App-logo" alt="logo" height="360"/>
          </a>
          </nav>
          <div className="container-fluid mt-5 text-center">
          <br></br>
            <h1>Welcome to Blockify! 
                We provide an expedient and transparent solution for your next real estate transactions!</h1>
            <h2>This is your current account address {this.state.account}</h2>
            <br></br>
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className='mb-3'> 
                  <Tab eventKey="Mint Property" title="Mint Property">
                    <div>
                    <br></br>
                      Would you like to mint your property?
                      <br></br>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        let address = this.mint
                        this.mintProperty(address)
                      }}>
                        <div className='form-group mr-sm-2'>
                        <br></br>
                          <input
                            id='mintProperty'
                            type='string'
                            ref={(input) => { this.mint = input }}
                            className="form-control form-control-md"
                            placeholder='address...'
                            required />
                        </div>
                        <button type='submit' className='btn btn-primary'>Mint Address</button>
                      </form>
                    </div>
                  </Tab>
                  <Tab eventKey="listPropertyForSale" title="List Property for Sale">
                  <div>
                  <br></br>
                   Would you like to list <b>{this.state.addressName.value  ? this.state.addressName.value : null}</b> a property for sale.
                    <form onSubmit={(e) => {
                      e.preventDefault()

                      const address = this.address
                      const price = window.web3.utils.toWei(this.salePrice.value.toString(), 'Ether')
                      this.listPropertyForSale(address,price)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='address'
                          type='text'
                          ref={(address) => {this.address = address }}
                          className="form-control form-control-md"
                          placeholder='Address Name'
                          required />
                      </div>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='salePrice'
                          type='text'
                          ref={(salePrice) => {this.salePrice = salePrice }}
                          className="form-control form-control-md"
                          placeholder='Listing Price(in Eth)'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>List Your Property for Sale! </button>
                    </form>

                  </div>
                </Tab>
                <Tab eventKey="buyPropertyForSale" title="Buy a Property">
                  <div>
                  <br></br>
                    Are you ready to buy?
                    <form onSubmit={(e) => {
                      e.preventDefault()

                      let address = this.address
                      const price = window.web3.utils.toWei(this.purchasePrice.value.toString(), 'Ether')

                      this.buyProperty(address,price)
                    }}>
                    <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='address'
                          type='text'
                          ref={(address) => {this.address = address }}
                          className="form-control form-control-md"
                          placeholder="Listing address to purchase"
                          required />
                      </div>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='purchasePrice'
                          type='text'
                          ref={(purchasePrice) => {this.purchasePrice = purchasePrice }}
                          className="form-control form-control-md"
                          placeholder='Purchase Price(in Eth)'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>Buy a Property</button>
                    </form>

                  </div>
                </Tab>
                </Tabs>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default App;


  


  