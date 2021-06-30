import { Component } from '@angular/core';
import Web3 from 'web3';
const { create } = require('ipfs-http-client');
const ipfs = create({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ethereum-social';
  imageUrl = 'https://via.placeholder.com/200C/';
  description:any;
  ipfs_image_path: string;
  web3:any;
  account:any;
  ethereumsocial:any;
  images = [];
  imageCount:any;
  buffer:any;
  tipAmount:any;
  contractAddress = "0xf651f8a828C9E1EaEB88e425373e9949183B8e2A";
  contractAbi =  [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tipAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address payable",
          "name": "author",
          "type": "address"
        }
      ],
      "name": "ImageCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tipAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address payable",
          "name": "author",
          "type": "address"
        }
      ],
      "name": "ImageTipped",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "imageCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "images",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "tipAmount",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "author",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_imageHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "uploadImage",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "tipImageOwner",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    }
  ];
  constructor(){
    
  }


  async ngOnInit(){
    await this.bootstrapWeb3()
    await this.bootstrapBlockchainData();
    this.tipAmount = this.web3.utils.toWei('0.1', 'Ether');
  }

  async bootstrapWeb3(){
   this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  async bootstrapBlockchainData(){
    let accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
    this.ethereumsocial = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    this.imageCount =await this.ethereumsocial.methods.imageCount().call();

    this.loadListOfData();
  }

  captureFile(event){
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () =>{
      this.buffer = reader.result;
    }
  }

  async uploadImage(){
    var result = await ipfs.add(this.buffer);
    let imageHash = result.path;
    this.ethereumsocial.methods.uploadImage(imageHash,this.description).send({from: this.account,gasPrice: '10000000000000',gas: 1000000}).on('transactionHash', (hash)=>{
     
    });
    await this.loadListOfData();
  }

  async loadListOfData(){
    this.images = [];
    for(var i = 1; i<=this.imageCount; i++){
      const image = await this.ethereumsocial.methods.images(i).call();
      this.images.push(image);
    }
    await this.sortImages();
  }

  async tipImageOwner(id){
    
    this.ethereumsocial.methods.tipImageOwner(id).send({from: this.account,gasPrice: '10000000000000',gas: 1000000, value: this.tipAmount }).on('transactionHash', (hash)=>{     
    });
  }

  async sortImages(){
    this.images.sort((a,b) => b.tipAmount - a.tipAmount);
  }
}
