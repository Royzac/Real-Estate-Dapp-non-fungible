import realEstateTransaction from '../abis/realEstateTransaction.json'
import { React, Component} from 'react';
import Web3 from 'web3';
import Navbar from './NavBar'
import logo from './logo.png';
import { render } from 'react-dom';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.detectAccountChange()
  };

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
  };

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    // Network ID
    const networkId = await web3.eth.net.getId()

    const balance = await web3.eth.getBalance(accounts[0])
    
    this.setState({account: accounts[0], balance: balance, web3: web3 })
    
    const networkData = realEstateTransaction.networks[networkId]

    if(networkData) {
      // Assign contract
      const contract = new web3.eth.Contract(realEstateTransaction.abi, networkData.address)
      this.setState({ contract })
      } else {
      window.alert('smart contract not deployed to detected network.')
    }};

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
    };

    constructor(props) {
      super(props)
        this.state = {
          account: '',
          propertyToken: null,
          Balance: 0,
          loading: true
      }};

    // this.mintProperty = this.mintProperty.bind(this)
    // this.buyProperty = this.listPropertyForSale.bind(this)
    // this.listProperty = this.listPropertyForSale.bind(this)


      mintProperty(_addressName) {
        this.setState({ loading: true })
        this.state.contract.methods.listProperty(_addressName).send({ from: this.state.account })
        .once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()
        })
      }

      listPropertyForSale(_addressName, price) {
        this.setState({ loading: true })
        this.state.contract.methods.listPropertyForSale(_addressName, price).send({ from: this.state.account })
        .once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()
        })
      }
    
      buyProperty(_addressName, price) {
        this.setState({ loading: true })
        this.state.contract.methods.buyProperty(_addressName).send({ from: this.state.account, value: price })
        .once('confirmation', (confirmation) => {
          this.setState({ loading: false })
          window.location.reload()
        })
      }

    
      render() {
        let content
        if(this.state.loading) {
          content = <p id="loader" className="text-center">Loading...</p>
        } else {
          content = <Main
            ethBalance={this.state.ethBalance}
            tokenBalance={this.state.tokenBalance}
            buyTokens={this.buyTokens}
            sellTokens={this.sellTokens}
          />
        }
    
        return (
          <div>
            <Navbar account={this.state.account} />
            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                  <div className="content mr-auto ml-auto">
                    <a
                      href="http://www.dappuniversity.com/bootcamp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    </a>
    
                    {content}
    
                  </div>
                </main>
              </div>
            </div>
          </div>
        );
      }
    }
    
    
    
    
    
export default App;
    
    
    
    
    
    
    
<Tab eventKey="listPropertyForSale" title="List Property For Sale">
                  <div>
                  <br></br>
                    Would you like to list your property for sale?
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.salePrice
                      let address = this.address
                      amount = amount * 10**18 //convert to wei
                      this.listPropertyForSale(address,amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='salePrice'
                          step="0.01"
                          type='number'
                          ref={(address,salePrice) => { this.salePrice = salePrice, this.address = address }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>List your Property for Sale! {this.state.address} </button>
                    </form>

                  </div>
                </Tab>

let purchase = await instance.buyProperty("50 King St.", { from: buyer, value: web3.utils.toWei('2', 'Ether') });
