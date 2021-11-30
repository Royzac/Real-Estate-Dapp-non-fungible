import { Tabs, Tab } from 'react-bootstrap'
import realEstateTransaction from '../abis/realEstateTransaction.json'
import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';

class App extends Component {

    async componentWillMount() {
      await this.loadBlockchainData(this.props.dispatch)
    }
  
    async loadBlockchainData(dispatch) {
      if(typeof window.ethereum!=='undefined'){
        const web3 = new Web3(window.ethereum)
        const netId = await web3.eth.net.getId()
        const accounts = await web3.eth.getAccounts()
  
        //load balance
        if(typeof accounts[0] !=='undefined'){
          const balance = await web3.eth.getBalance(accounts[0])
          this.setState({account: accounts[0], balance: balance, web3: web3})
        } else {
          window.alert('Please login with MetaMask')
        }
  
        //load contracts
        try {
          const reTransaction = new web3.eth.Contract(realEstateTransaction.abi, realEstateTransaction.networks[netId].address)
          this.setState({contract: reTransaction})
        } catch (e) {
          console.log('Error', e)
          window.alert('Contract not deployed to the current network')
        }
  
      } else {
        window.alert('Please install MetaMask')
      }
    }

    async mintProperty(_address) {
      if(this.state.contract!=='undefined'){
        try{
          this.state.address = _address
          await this.state.contract.methods.mintProperty(_address).send({ from: this.state.account }).once('confirmation', (confirmation) => {
          this.state.address = _address
          this.setState({ loading: false })
          window.location.reload()})
          console.log('You have now minted this address!')
        } catch (e) {
          console.log('Error, issue minting: ', e)
          return `${_address} has already been claimed!`
        }
      }
    }

    async listPropertyForSale(_address,price) {
      if(this.state.contract!=='undefined'){
        try{
          await this.state.contract.methods.listPropertyForSale(_address,price).send({ from: this.state.account }).once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()})
          console.log('You have listed your property for sale!')
        } catch (e) {
          console.log('Error, listing property for sale: ', e)
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
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
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
                  <Tab eventKey="listPropertyForSale" title="List Property For Sale">
                  <div>
                  <br></br>
                    Would you like to list your property for sale?
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      // let price = this.salePrice
                      let amount = Web3.utils.toWei('1', 'Ether') 
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

  