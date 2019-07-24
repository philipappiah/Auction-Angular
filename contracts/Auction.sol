pragma solidity >=0.4.0 <0.6.0;
pragma experimental ABIEncoderV2;


contract Auction {

struct bidItems{
    uint itemId;
    string itemHash;
    address payAddress;
    uint amountToBePaid;
   
}

struct newItems{
    uint itemId;
    string itemHash;
    uint price;
    string description;
}

newItems [] public itemBody;
bidItems [] public itemData;
uint id;


function addNewItemTolist(string memory itemhash, uint itemprice, string memory itemdescription) public{
    itemBody.push(newItems(id,itemhash,itemprice,itemdescription));
    id++;
}


function getItems(uint index) public view  returns(uint, string memory, uint, string memory){
    return (itemBody[index].itemId,itemBody[index].itemHash,itemBody[index].price,itemBody[index].description);
}


function getBidder(uint itemid,uint amt, string memory itemhash) public{       
    itemData.push(bidItems(itemid,itemhash,msg.sender, amt));  
}


function getBiddersData(uint index) public view returns (uint,string memory,address,uint){
    return (itemData[index].itemId,itemData[index].itemHash,itemData[index].payAddress,itemData[index].amountToBePaid);
        
}


function getFinalPayment() public payable{
    
}

function getBidItemsLength() public view returns (uint){
    return itemData.length;
}


function getTotalItemslength() public view returns (uint){
    return itemBody.length;
}



}