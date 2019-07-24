import { Component, OnInit, ViewChild, AfterViewInit, Directive, } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
const auction = require('../../../build/contracts/Auction.json');




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

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar, private router: Router, route: ActivatedRoute) {
    console.log('Constructor: ' + web3Service);
    this.myId = route.snapshot.params['id'];


  }

  ngOnInit(): void {
    


    console.log('OnInit: ' + this.web3Service);
    console.log(this);

    console.log(this.myId);

    //Initialize the contract on page load
    this.web3Service.artifactsToContract(auction)
      .then((ActionBidContract) => {
        this.Auction = ActionBidContract;

        //call the get data function in the solidity contract to load items
        this.watchAccount();
        this.getData();
        this.getBidders();






      });




    this.watchAccount();

  }

  watchAccount() {
    //Get current user's account using web3
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];

    });
  }



  setStatus(status) {
    //Display toasr message
    this.matSnackBar.open(status, null, { duration: 3000 });
  }





  async getData() {


    this.setStatus('Page loading... (please wait)');
    try {


      const auctionContract = await this.Auction.deployed();


      //Call the get items method in the contract to display
      auctionContract.getItems(this.myId, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          //console.log(result);

          //return result;


          var pref = "https://ipfs.io/ipfs/";
          let j = 0;

          //push the object returned from the function call into an array
          this.myitems.push({
            id: result[j],
            hash: pref + result[j + 1],
            price: result[j + 2],
            description: result[j + 3].substr(0, 70)

          });
          //console.log(this.myitems);



        }
      });


    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }

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
          for (var i = 0; i < len; i++) {
            auctionContract.getBiddersData(i, (error, result) => {
              if (error) {
                console.log(error);
              } else {
                //console.log(result);
                let j = 0;
                if (result[j] == this.myId) {
                  this.getBiddersAddress.push({
                    id: result[j],
                    hash: result[j + 1],
                    address: result[j + 2],
                    bidAmount: result[j + 3]


                  });





                }


                //console.log(this.getBiddersAddress);
              }



            });
          }
        }
      });







      //Call the get items method in the contract to display

    } catch (e) {
      console.log(e);
      this.setStatus('Transaction was cancelled.');
    }
  }

  async sendBid() {
    if (!this.Auction) {
      this.setStatus('Auction contract is not loaded, unable to send transaction');
      return;
    }

    this.setStatus('Initiating transaction... (please wait)');
    try {
      let itemId, itemHash;

      this.myitems.forEach(element => {
        itemId = element.id;
        itemHash = element.hash;


      });
      let reqHash = itemHash.substr(21);
      const auctionContract = await this.Auction.deployed();
      let amount = (<HTMLInputElement>document.getElementById('amount')).value;
      let reqAmount = +amount;
      //alert(amount);
      if (reqAmount <= 0) {
        alert("Amount must be greater than 0");
        return;

      }




      //Call the get items method in the contract to display
      let makeBid = await auctionContract.getBidder(itemId, reqAmount, reqHash, { from: this.model.account });
      if (!makeBid) {
        this.setStatus('Transaction failed. Your bid could not be submitted.');
        alert('Transaction failed. Your bid could not be submitted.');

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


