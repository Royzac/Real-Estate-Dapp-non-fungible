pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Blockify, a contract for real estate transaction
/// @author Zachary Royals
/// @notice For now, this contract just make simple transaction, transferring a property token from one owner to the next.

contract realEstateTransaction is Ownable{
    constructor() Ownable() {
    }

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

    modifier mintDoesNotExist(string memory _address) {
        require(propertyToId[_address] == 0, "this address has already been claimed!");
        _;
    }

    function mintProperty(string calldata _address) public mintDoesNotExist(_address) returns(string memory){

        uint16 propertyToken = uint16(uint(keccak256(abi.encodePacked(_address))));
        idToOwner[propertyToken] = msg.sender;
        ownerToId[msg.sender] = propertyToken;
        propertyToId[_address] = propertyToken;
        emit Mint(msg.sender, propertyToken,"a new property has has been minted!");
        return "You have minted your property, and are now the official Owner of this property!";
    }


    modifier isOwner (uint16 _propertyToken) {
      require(idToOwner[_propertyToken] == msg.sender, "is not the owner");
        _;
    }

    modifier paidEnough(string memory _addressName) { 
    uint16 propertyToken = propertyToId[_addressName];
    require(msg.value >= properties[propertyToken].price); 
    _;
   }

    modifier forSale(string memory _addressName){
    uint16 propertyToken = propertyToId[_addressName];
    require((properties[propertyToken].seller != address(0)) && (properties[propertyToken].state == State.ForSale));
    _;
  }

    modifier sold(uint16 _propertyToken) {
    require(properties[_propertyToken].state == State.Sold, "not sold, still looking for a buyer");
  _;
  }

  
    function listPropertyForSale(string calldata _addressName, uint _price) public returns(uint16)
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

    function updateStatus(uint16 _propertyToken) internal{
        idToOwner[_propertyToken] = msg.sender;
        properties[_propertyToken].seller = payable(msg.sender);
        properties[_propertyToken].state = State.Other;
        emit NewOwner(_propertyToken,properties[_propertyToken].seller,"The property has a new owner!");

    }

    function buyProperty(string memory _addressName) public payable 
    forSale(_addressName) paidEnough(_addressName)  {
        uint16 propertyToken = propertyToId[_addressName];
        properties[propertyToken].seller.transfer(msg.value);
        properties[propertyToken].state = State.Sold;
        emit LogSold(properties[propertyToken].propertyName,propertyToken);
        updateStatus(propertyToken);
    }
}
