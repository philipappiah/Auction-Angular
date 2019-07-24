import {Component, OnInit, Input} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

declare let require: any;
const auction = require('../../../../build/contracts/Auction.json');
const Web3 = require('web3');
declare let window: any;
@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {

  @Input() public myInputVariable: string;
  accounts: string[];
  Auction: any;
  myitems = [];

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar,private router: Router) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.web3Service.artifactsToContract(auction)
      .then((MetaCoinAbstraction) => {
        this.Auction = MetaCoinAbstraction;

        this.getData();
        
        
          
        
        
       
      });
      
     

    
    this.watchAccount();
    
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      
    });
  }

  

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  



  async getData(){

    let len;
    this.setStatus('Page loading... (please wait)');
    try {
   

    const auctionContract =  await this.Auction.deployed();
      auctionContract.getTotalItemslength((error, result) => {
        if(error){
          console.log(error);
        }else{
          console.log(result);
          len=result;
          for (var i = 0; i < len; i++) {
            auctionContract.getItems(i,(error, result)=> {
              if (error) {
                console.log(error);
              } else {
                //console.log(result);

                //return result;
                var pref = "https://ipfs.io/ipfs/";
                let j = 0;
                this.myitems.push({
                  id:result[j],
                  hash:pref+result[j+1],
                  price:result[j+2],
                  description:result[j+3].substr(0,70)

                });
                console.log(this.myitems);

                
                
              }
            });
        

            
          }
        }
      
      }); 
    

      
     

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }

  }
  

  async sendCoin() {
    if (!this.Auction) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    
    this.setStatus('Initiating transaction... (please wait)');
    try {
      // const auctionContract = await this.Auction.deployed();
      // const val = window.web3.toWei(3, 'ether');
      // console.log(val);
      // let itemhash = "QmVBEXV69AJBYXwT85Lngq6nFKM2SoygHVf1RtDBh5HZ1G";
      // let itemprice = 2;
      // let itemdescription = "Samsung HD TV 55 inches with 2 years warranty. This comes with an android operating system making it one othe smartest in the market.";

      //  let itemhash = "QmXqhwL75kozBEMefd1XpYXMFBjDYHqhSQX3Eo7koPD5kV";
      //   let itemprice = 3;
      //   let itemdescription = "Get this fully cushioned sofa made from the best of materials.";
      
      
    //   const transaction = await auctionContract.addNewItemTolist(itemhash, itemprice, itemdescription,{from:this.model.account});

    //   if (!transaction) {
    //     this.setStatus('Transaction failed!');
    //   } else {
    //     this.setStatus('Transaction complete!');
    //   }


    const auctionContract =  await this.Auction.deployed();
      auctionContract.getTotalItemslength(function(error, result){
        if(error){
          console.log(error);
        }else{
          console.log(result);
        }
      }); 
        
     

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }

    
  }


 
 



  

}
