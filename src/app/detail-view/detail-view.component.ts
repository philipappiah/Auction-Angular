import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';


declare let require: any;
const auction = require('../../../build/contracts/Auction.json');
const myhttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgyNzQ4NmYzMzUyM0RGQjMyM2VlNDdlOEU0Mjc5MjY5QmU3MTlFYzZBIiwiZGFwcE5hbWUiOiJDb2xsZWN0aWJsZXNQb0MiLCJzY29wZXMiOiJyZWFkLHdyaXRlIiwiaWF0IjoxNTYzODAwOTMyLCJleHAiOjE1NjYzOTI5MzIsImF1ZCI6IjJiN2MzYmUwLTg1ZjMtMTFlOS1hNjM5LTk3N2JkMWM3MzlmMiIsImlzcyI6IktleUNvbm5lY3QiLCJzdWIiOiIweDI3NDg2ZjMzNTIzREZCMzIzZWU0N2U4RTQyNzkyNjlCZTcxOUVjNkEifQ.nXpKkP7ChI6wQBFN732LQxxLXxd1rjomlh6MZtyhxE0JIGOIsJdch-Xes2la6aXgEpOxpyrAjp7AtvYQ95nmxd9cSyVFQw52I-zM-qJGvzIuOyXBKt9--mTfTKU6abY_GvcF6Nsvn7GPwD719WcLtYilZk3jwzVoMlE1xrewi820uNmFKFYmLM3s5PdOQeEfAy2bmyeV-lH_nQMaFHMWJPKzmwK_prHVRTSGQA24DML1lK7hK8x4nQ5V75AEgoTXquMbptO9VVrejfcAO1p4LDeejvy8Q_dbBRL-NuYLkdM3XRdWJ13ecPwpPtoiOrq_9EjCV7GAOi5LUCDQUbbCZA'
});

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit {
  accounts: string[];
  Auction: any;
  myitems = [];
  getBiddersAddress = [];
  getCurrentItemBidders = [];
  myId;


  
  

  model = {
    account: ''
  };

  dataModel = [];
  responseData = [];
  bidArray = [];
  highestBid;

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar, route: ActivatedRoute, private http: HttpClient) {
    console.log('Constructor: ' + web3Service);
    //Get id from route parameter
    this.myId = route.snapshot.params['id'];


  }

  ngOnInit(): void {




    this.setStatus('Page is loading... (please wait)');
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    //console.log(this.getAll());


    this.getTokenIds();

    this.web3Service.artifactsToContract(auction)
      .then((MetaCoinAbstraction) => {
        this.Auction = MetaCoinAbstraction;
        this.getBidders();

      });



  }

  //Display toast message
  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }



  //Get current user's account using web3
  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
    });
  }

  async getBidders() {
    var len;
    if (!this.Auction) {
      this.setStatus('Auction contract is not loaded, unable to send transaction');
      return;
    }

    try {
      const auctionContract = await this.Auction.deployed();
      auctionContract.getBidItemsLength((error, result) => {
        if (error) {
          console.log(error);
        } else {
          len = result;
          console.log(result);
          for (var i = 0; i < len; i++) {
            auctionContract.getBiddersData(i, (error, result) => {
              if (error) {
                console.log(error);
              } else {
                console.log(result);
                let j = 0;
                if (result[j] == this.myId) {
                  this.getBiddersAddress.push({
                    id: result[j],
                    address: result[j + 1],

                    bidAmount: result[j + 2]


                  });

                }
                this.getBiddersAddress.forEach(elem => {
                  this.bidArray.push(elem.bidAmount);
                })

                this.highestBid = Math.max(...this.bidArray);


              }
            });
          }
        }
      });

    } catch (e) {
      console.log(e);
      this.setStatus('Transaction was cancelled.');
    }
  }









  getDataLength() {


    return this.http.get('https://collectibles-poc-api.herokuapp.com/api/v1/tokens/0x687f9f4f065e763111bcb0e7e301bca3f3e5dce4/available', { headers: myhttpHeaders });
  }








  //Get the token Ids
  getTokenIds() {

    let len;

    this.getDataLength().subscribe(data => {

      len = data["count"];


      console.log(data["count"]);



      for (let i = 0; i < len; i++) {
        this.dataModel.push(
          data["result"][i].tokenId

        )
      }








      this.http.get('https://collectibles-poc-api.herokuapp.com/api/v1/tokens/' + this.myId + '/metadata', { headers: myhttpHeaders })
        .subscribe((data: { result }) => {
          console.log(data);
          this.responseData.push(data.result);

        })






      //console.log(this.responseData)




    })


  }

  //Make a bid on the current item
  async makeBid() {
    console.log();

    if (!this.Auction) {
      this.setStatus('Auction contract is not loaded, unable to send transaction');
      return;
    }

    this.setStatus('Initiating transaction... (please wait)');
    try {


      const auctionContract = await this.Auction.deployed();
      let amount = (<HTMLInputElement>document.getElementById('amount')).value;
      let reqAmount = +amount;


      if (reqAmount <= 0) {
        alert("Amount must be greater than 0");
        this.setStatus('Transaction Failed');
        return;
      }

      //Check whether user makes a bid less than or equal to the highest bid
      if (reqAmount <= this.highestBid) {
        alert("Amount must be greater than the current highest bid");
        this.setStatus('You must bid higher than the current highest bid.');
        return;

      }

      //Call the get items method in the contract to display
      let makeBid = await auctionContract.getBidder(this.myId, amount, { from: window.web3.currentProvider.selectedAddress });
      if (!makeBid) {
        this.setStatus('Transaction failed. Your bid cannot make a bid which is less the current highest bidder.');
        alert('Transaction failed. Your bid cannot make a bid which is less the current highest bidder.');

      } else {
        alert('Transaction confirmed.');
        this.setStatus('Transaction Sucessful. Your bid has been submitted.');
      }

    } catch (e) {
      console.log(e);
      this.setStatus('Transaction was cancelled.');
    }


  }


}
