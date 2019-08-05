import { Component, OnInit, Input } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare let require: any;
const auction = require('../../../../build/contracts/Auction.json');
const Web3 = require('web3');

declare let window: any;
let accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgyNzQ4NmYzMzUyM0RGQjMyM2VlNDdlOEU0Mjc5MjY5QmU3MTlFYzZBIiwiZGFwcE5hbWUiOiJDb2xsZWN0aWJsZXNQb0MiLCJzY29wZXMiOiJyZWFkLHdyaXRlIiwiaWF0IjoxNTYzODAwOTMyLCJleHAiOjE1NjYzOTI5MzIsImF1ZCI6IjJiN2MzYmUwLTg1ZjMtMTFlOS1hNjM5LTk3N2JkMWM3MzlmMiIsImlzcyI6IktleUNvbm5lY3QiLCJzdWIiOiIweDI3NDg2ZjMzNTIzREZCMzIzZWU0N2U4RTQyNzkyNjlCZTcxOUVjNkEifQ.nXpKkP7ChI6wQBFN732LQxxLXxd1rjomlh6MZtyhxE0JIGOIsJdch-Xes2la6aXgEpOxpyrAjp7AtvYQ95nmxd9cSyVFQw52I-zM-qJGvzIuOyXBKt9--mTfTKU6abY_GvcF6Nsvn7GPwD719WcLtYilZk3jwzVoMlE1xrewi820uNmFKFYmLM3s5PdOQeEfAy2bmyeV-lH_nQMaFHMWJPKzmwK_prHVRTSGQA24DML1lK7hK8x4nQ5V75AEgoTXquMbptO9VVrejfcAO1p4LDeejvy8Q_dbBRL-NuYLkdM3XRdWJ13ecPwpPtoiOrq_9EjCV7GAOi5LUCDQUbbCZA"
let user = [];

const myhttpHeaders = new HttpHeaders ({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgyNzQ4NmYzMzUyM0RGQjMyM2VlNDdlOEU0Mjc5MjY5QmU3MTlFYzZBIiwiZGFwcE5hbWUiOiJDb2xsZWN0aWJsZXNQb0MiLCJzY29wZXMiOiJyZWFkLHdyaXRlIiwiaWF0IjoxNTYzODAwOTMyLCJleHAiOjE1NjYzOTI5MzIsImF1ZCI6IjJiN2MzYmUwLTg1ZjMtMTFlOS1hNjM5LTk3N2JkMWM3MzlmMiIsImlzcyI6IktleUNvbm5lY3QiLCJzdWIiOiIweDI3NDg2ZjMzNTIzREZCMzIzZWU0N2U4RTQyNzkyNjlCZTcxOUVjNkEifQ.nXpKkP7ChI6wQBFN732LQxxLXxd1rjomlh6MZtyhxE0JIGOIsJdch-Xes2la6aXgEpOxpyrAjp7AtvYQ95nmxd9cSyVFQw52I-zM-qJGvzIuOyXBKt9--mTfTKU6abY_GvcF6Nsvn7GPwD719WcLtYilZk3jwzVoMlE1xrewi820uNmFKFYmLM3s5PdOQeEfAy2bmyeV-lH_nQMaFHMWJPKzmwK_prHVRTSGQA24DML1lK7hK8x4nQ5V75AEgoTXquMbptO9VVrejfcAO1p4LDeejvy8Q_dbBRL-NuYLkdM3XRdWJ13ecPwpPtoiOrq_9EjCV7GAOi5LUCDQUbbCZA' 
});
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

  dataModel=[];
  responseData = [];

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar, private router: Router,private http: HttpClient) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    this.setStatus('Page is loading... (please wait)');
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    //console.log(this.getAll());
    let j = 0;
   
   this.getTokenIds();
  
    this.web3Service.artifactsToContract(auction)
      .then((MetaCoinAbstraction) => {
        this.Auction = MetaCoinAbstraction;

        
      });
    this.watchAccount();

  }



  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];

    });
  }

  

//Get Contract Address
  async getContractAddress(){
    const auctionContract = await this.Auction.deployed();
    return auctionContract.address;
  }

  ///Get incoming data Length
  getDataLength() { 
    
   
    return this.http.get('https://collectibles-poc-api.herokuapp.com/api/v1/tokens/0x687f9f4f065e763111bcb0e7e301bca3f3e5dce4/available',{headers:myhttpHeaders});
    }

  

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }


  getTokenIds() {

    let len;
    
   this.getDataLength().subscribe(data =>{
   
    len = data["count"];


    console.log(data["count"]);


    for(let i = 0; i < len; i++){
      this.dataModel.push(
        data["result"][i].tokenId
  
      )
      }
    

      
      this.dataModel.forEach(el=>{
       
      
      this.http.get('https://collectibles-poc-api.herokuapp.com/api/v1/tokens/'+el+'/metadata',{headers:myhttpHeaders})
      .subscribe((data: { result } )=>{
        console.log(data);
        this.responseData.push(data.result);
      })
       
      })


      //console.log(this.responseData)

      

     
    })
    
    
  }


getData(){
  this.getTokenIds()
  
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


      const auctionContract = await this.Auction.deployed();
      auctionContract.getTotalItemslength(function (error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });



    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }


  }









}
