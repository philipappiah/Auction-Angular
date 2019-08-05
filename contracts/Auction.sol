pragma solidity >=0.4.0 <0.6.0;


import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";

contract Auction is IERC721Receiver {
uint256[] tokens;

 struct BiddersData {
    uint256 itemId;  
    address payAddress;
    uint bidAmount;
 }

 BiddersData[] public bidders;
 uint maxBid;
 mapping( uint256 => BiddersData)highestAmount;

function getBidder(uint256 itemid,uint amount) public {  
    //To be added later when compiled
      BiddersData storage currentHigh = highestAmount[itemid];
      require(amount > currentHigh.bidAmount);
      currentHigh.bidAmount = amount;
        
      
      bidders.push(BiddersData(itemid,msg.sender, amount));  
}


function getBiddersData(uint index) public view returns (uint256,address,uint) {
    return (bidders[index].itemId,bidders[index].payAddress,bidders[index].bidAmount);
        
}


function getFinalPayment() public payable {
    
}

function getBidItemsLength() public view returns (uint) {
    return bidders.length;
}


function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
    tokens.push(tokenId);
    return this.onERC721Received.selector;
}

}