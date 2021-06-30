// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Ethereumsocial {
  string public name = "Ethereumsocial";
  uint public imageCount = 0;
  // Store images 
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string ipfsHash;
    string description;
    uint tipAmount;
    address payable author;
  }
  constructor() public {
  } 
   
  event ImageCreated(uint id, string ipfsHash, string description, uint tipAmount, address payable author);
  event ImageTipped(uint id, string ipfsHash, string description, uint tipAmount, address payable author);
  // Create Images
  function uploadImage(string memory _imageHash, string memory _description) public {
    //validate that the imageHash and description are never empty
    require(bytes(_imageHash).length > 0);
    //validate that the imageHash and description are never empty
    //require(bytes(_description).length > 0);
    //validate that the imageHash and description are never empty
    //require(msg.sender != address(0x0));
    // increment the image count
    imageCount++;
    //Add image to contract
    images[imageCount]  = Image(imageCount, _imageHash, _description, 0, msg.sender);

    //publish image created event
    emit ImageCreated(imageCount, _imageHash, _description, 0, msg.sender);
  }
  // Tip images

  function tipImageOwner(uint _id) public payable{
    //validate the id
    require(_id > 0 && _id <= imageCount);

    //retrieve image from the storage
    Image memory _image = images[_id];

    //retrieve the image author from the storage
    address payable _author = _image.author;

    //pay author by sending him/her Ether
    _author.transfer(msg.value);
    

    //increment the tip amount 
    _image.tipAmount = _image.tipAmount + msg.value;

    //update image 
    images[_id] = _image;

    //publish image tiped event
    emit ImageCreated(_id, _image.ipfsHash, _image.description, _image.tipAmount, _author);
  }

}
