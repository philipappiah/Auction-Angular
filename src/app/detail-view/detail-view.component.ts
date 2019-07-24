import { Component, OnInit,ViewChild,AfterViewInit, Directive, } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


declare let require: any;
const auction = require('../../../build/contracts/Auction.json');
const Web3 = require('web3');
declare let window: any;

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit {
  panelOpenState = false;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  accounts: string[];
  Auction: any;
  myitems = [];
  myId;

 

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar,private router: Router, route:ActivatedRoute) {
    console.log('Constructor: ' + web3Service);
    this.myId = route.snapshot.params['id'];
    
    
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;


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
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  



  async getData(){

  
    this.setStatus('Page loading... (please wait)');
    try {
   

         const auctionContract =  await this.Auction.deployed();
      
          
          //Call the get items method in the contract to display
            auctionContract.getItems(this.myId,(error, result)=> {
              if (error) {
                console.log(error);
              } else {
                //console.log(result);

                //return result;

                
                var pref = "https://ipfs.io/ipfs/";
                let j = 0;

                //push the object returned from the function call into an array
                this.myitems.push({
                  id:result[j],
                  hash:pref+result[j+1],
                  price:result[j+2],
                  description:result[j+3].substr(0,70)

                });
                //console.log(this.myitems);

                
                
              }
            });
        

            
          
        
      
        
    

      
     

    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }

  }
  

  async sendBid() {
    if (!this.Auction) {
      this.setStatus('Auction contract is not loaded, unable to send transaction');
      return;
    }

    this.setStatus('Initiating transaction... (please wait)');
    try {
         let itemId, itemHash, itemPrice;

        this.myitems.forEach(element =>{
          itemId = element.id;
          itemHash = element.hash;
          

        });
        let reqHash = itemHash.substr(21);
        const auctionContract =  await this.Auction.deployed();
        let amount = (<HTMLInputElement>document.getElementById('amount')).value;
        let reqAmount = +amount;
        //alert(amount);
        if(reqAmount <= 0){
          alert("Amount must be greater than 0");
          return;

        }
        
       
      
          
          //Call the get items method in the contract to display
           let makeBid = await auctionContract.getBidder(itemId,reqAmount,reqHash,{from:this.model.account});
               if(!makeBid){
                this.setStatus('Transaction failed. Your bid could not be submitted.');
                alert('Transaction failed. Your bid could not be submitted.');

               }else{
                 alert('Transaction confirmed.');
                this.setStatus('Transaction Sucessful. Your bid has been submitted.');
               }

    } catch (e) {
      console.log(e);
      this.setStatus('Transaction was cancelled.');
    }

    
  }


 
 




}
