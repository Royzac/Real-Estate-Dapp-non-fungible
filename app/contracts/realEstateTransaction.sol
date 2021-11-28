pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract realEstateTransaction is Ownable{

    event Mint(address indexed _to, uint16 tokenProperty,string status);
    event noMint(address indexed _to, string status);
    event LogForSale(string _addressName, uint16 propertyToken, uint _price);
    event LogSold(string addressName,uint16 propertyToken);
    event NewOwner(uint16 propertyToken,address _newOwner, string status);

    mapping(uint16 => address) internal idToOwner;
    mapping(address => uint16) internal ownerToId;
    mapping(uint16 => string) public  idToProperty;
    mapping(string => uint16) internal propertyToId;
    mapping(uint16 => Property) public properties;

    constructor() Ownable() {
    }

    modifier mintDoesNotExist(string memory _address) {
        require(propertyToId[_address] == 0);
        _;
    }
    // set limit on property
    function mintProperty(string memory _address) public mintDoesNotExist(_address) returns(string memory){

        uint16 propertyToken = uint16(uint(keccak256(abi.encodePacked(_address))));
        idToOwner[propertyToken] = msg.sender;
        ownerToId[msg.sender] = propertyToken;
        propertyToId[_address] = propertyToken;
        emit Mint(msg.sender, propertyToken,"a new property has has been minted!");
        return "You have minted your property, and are now the official Owner of this property!";
    }

    enum State{
       Other,
       ForSale,
       Sold
    }

    struct Property{
      string propertyName;
      uint price;
      State state;
      address payable seller;    
      }

    // fetch owner
    modifier isOwner (uint16 propertyToken) {
      require(idToOwner[propertyToken] == msg.sender, "is not the owner");
        _;
    }

    modifier paidEnough(uint _price) { 
    require(msg.value >= _price); 
    _;
   }

    modifier forSale(uint16 _propertyToken){
    require((properties[_propertyToken].seller != address(0)) && (properties[_propertyToken].state == State.ForSale));
    _;
  }

    modifier sold(uint16 _propertyToken) {
    require(properties[_propertyToken].state == State.Sold, "not sold, still looking for a buyer");
  _;
  }

  // test for ownership
    function listPropertyForSale(string memory _addressName, uint _price) public returns(uint16)
    {   
        uint16 propertyToken = ownerToId[msg.sender];
        require(idToOwner[propertyToken] == msg.sender, "is not the owner!");
        properties[propertyToken] = 
        Property({
            propertyName: _addressName,
            price: _price, 
            state: State.ForSale, 
            seller: payable(msg.sender)
            });

        emit LogForSale(_addressName,propertyToken,_price);
        return propertyToken;
    }

    function updateStatus(uint16 propertyToken) internal{
        idToOwner[propertyToken] = msg.sender;
        properties[propertyToken].seller = payable(msg.sender);
        properties[propertyToken].state = State.Other;
        emit NewOwner(propertyToken,properties[propertyToken].seller,"The property has a new owner!");

    }
  // change seller to owner, seller is inferred by the status
  //test for transfer of funds
    function buyProperty(uint16 propertyToken) public payable 
    forSale(propertyToken) paidEnough(properties[propertyToken].price) returns(string memory){
        properties[propertyToken].seller.transfer(properties[propertyToken].price);
        properties[propertyToken].state = State.Sold;
        emit LogSold(properties[propertyToken].propertyName,propertyToken);
        updateStatus(propertyToken);
        return "You have purchased this property!";

    }
}
