import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

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
  accounts: string[];
  Auction: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);

    
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

  async sendCoin() {
    // if (!this.Auction) {
    //   this.setStatus('Metacoin is not loaded, unable to send transaction');
    //   return;
    // }

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    
    this.setStatus('Initiating transaction... (please wait)');
    try {
      const auctionContract = await this.Auction.deployed();
      const val = window.web3.toWei(3, 'ether');
      console.log(val);
      
      const transaction = await auctionContract.getFinalPayment({from:this.model.account,value:val});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }



  

}
