const Ethereumsocial = artifacts.require("Ethereumsocial.sol");


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
   })
 
});
