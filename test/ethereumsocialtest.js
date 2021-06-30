const Ethereumsocial = artifacts.require("Ethereumsocial.sol");
require('chai')
  .use(require('chai-as-promised'))
  .should()


contract("Ethereumsocial", function ([deployer, author, tipper]) {
   let ethereumsocial;

   before(async () => {
     ethereumsocial = await Ethereumsocial.deployed();
   })

   describe('deployment', async () =>{
     it("should assert true", async function () {
       await Ethereumsocial.deployed();
       return assert.isTrue(true);
     });

     it('deploys successfully', async () => {
       const address = await ethereumsocial.address
       assert.notEqual(address, 0x0);
       assert.notEqual(address, '');
       assert.notEqual(address, null);
       assert.notEqual(address, undefined);
     })

     it('has a name', async () =>{
       const name = await ethereumsocial.name();
       assert.equal(name, 'Ethereumsocial')
     })
   })

   describe('images', async () => {
     let result, imageCount;
     let hash = 'imageHash1'
     let imageDescription = 'Image description';
     before(async () => {
      result = await ethereumsocial.uploadImage(hash, imageDescription, {from: author})
      imageCount = await ethereumsocial.imageCount();
     })

     it('create image', async () =>{
        //success 
        assert.equal(imageCount, 1)
        const event = result.logs[0].args;
        assert.equal(event.id.toNumber(), imageCount.toNumber())
        assert.equal(event.ipfsHash, hash)
        assert.equal(event.description, imageDescription)
        assert.equal(event.tipAmount, '0')
        assert.equal(event.author, author)

     })

     it('allows users to tip images', async () => {
       //track the author balance before purchase
       let oldAuthorBalance;
       oldAuthorBalance = await web3.eth.getBalance(author);
       oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
      
       result = await ethereumsocial.tipImageOwner(imageCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')});

       //success assertions
       const event = result.logs[0].args;
       assert.equal(event.id.toNumber(), imageCount.toNumber());
       assert.equal(event.ipfsHash, hash);
       assert.equal(event.description, imageDescription);
       assert.equal(event.tipAmount, '1000000000000000000');
       assert.equal(event.author, author);

       //confirm that the author received fund 
       let newAuthorBalance;
       newAuthorBalance = await web3.eth.getBalance(author);
       newAuthorBalance = new web3.utils.BN(newAuthorBalance);

       let tipImageOwner;
       tipImageOwner = web3.utils.toWei('1', 'Ether');
       tipImageOwner = new web3.utils.BN(tipImageOwner);

       const expectedBalance = oldAuthorBalance.add(tipImageOwner);

       assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

       //failure test. Tries to tip an image that does not exist
       await ethereumsocial.tipImageOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
     })
   })
 
});
