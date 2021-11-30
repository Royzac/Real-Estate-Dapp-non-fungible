import { Tabs, Tab } from 'react-bootstrap'
import realEstateTransaction from '../abis/realEstateTransaction.json'
import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.detectAccountChange()
  }

  async loadWeb3() {
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
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = realEstateTransaction.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(realEstateTransaction.abi, networkData.address)
      this.setState({ contract })
      const itemCount = await jaslist.methods.itemCount().call()
      this.setState({ itemCount })
      // Load products
      this.setState({ loading: false})
      // console.log(this.state.items)
    } else {
      window.alert('Jaslist contract not deployed to detected network.')
    }
  }
npm 
  detectAccountChange() {
    const ethereum = window.ethereum
    
    if(ethereum) {
      ethereum.on('accountsChanged', function (accounts) {
        // this.setState({ loading: false})
        window.location.reload()
      })

      ethereum.on('chainChanged', () => {
        window.location.reload()
        this.loadBlockchainData()
      })
    }
  }



    async mintProperty(_address) {
      if(this.state.contract!=='undefined'){
        try{
          this.state.address = _address
          await this.state.contract.methods.mintProperty(_address).send({ from: this.state.account }).once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()})
          console.log('You have now minted this address!')
        } catch (e) {
          console.log('Error, issue minting: ', e)
          return (
            <div>
                <h1>`${_address} has already been claimed!` </h1>
            </div>
        );

        }
      }
    }

    async listPropertyForSale(_address,price) {
      if(this.state.contract!=='undefined'){
        try{
          await this.state.contract.methods.listPropertyForSale(_address,price).send({ from: this.state.account}).once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()})
          console.log('You have listed your property for sale!')
        } catch (e) {
          console.log('Error, listing property for sale: ', e)
        }
      }
    }

    async buyProperty(_address,price) {
      if(this.state.contract!=='undefined'){
        try{
          await this.state.contract.methods.buyProperty(_address).send({ from: this.state.account, value: price }).once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()})
          console.log('You have listed your property for sale!')
        } catch (e) {
          console.log('Error, buying property for sale: ', e)
        }
      }
    }
  

      
    constructor(props) {
      super(props)
      this.state = {
        web3: 'undefined',
        account: '',
        contract: null,
        balance: 0,
        address: ''
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
          <img src={logo} className="App-logo" alt="logo" height="32"/>
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
                <Tabs pullright defaultActiveKey="profile" id="uncontrolled-tab-example" className='mb-3'> 
                  <Tab eventKey="Mint Property" title="Mint Property">
                    <div>
                    <br></br>
                      Would you like to mint your property?
                      <br></br>
                      <br></br>
                      (Only one address is possible at the time)
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
                    Would you like to list your property for sale?
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.salePrice
                      amount =  amount * 10 **18 
                      let address = this.address
                      this.listPropertyForSale(address,amount)
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
                      <button type='submit' className='btn btn-primary'>List Your Property for Sale! {this.state.address} </button>
                    </form>

                  </div>
                </Tab>
                <Tab eventKey="buyPropertyForSale" title="Buy a Property">
                  <div>
                  <br></br>
                    Are you ready to buy?
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.purchasePrice * 10 **18 
                      let address = this.address
                      this.buyProperty(address,amount)
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
                      <button type='submit' className='btn btn-primary'>Buy a Property {this.state.address} </button>
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

  