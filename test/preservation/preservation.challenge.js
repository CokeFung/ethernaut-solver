const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Preservation', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Preservation');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Preservation', deployer);
            const LibraryContractFactory = await ethers.getContractFactory('LibraryContract', deployer);
            const LibraryContractOne =  await LibraryContractFactory.deploy();
            const LibraryContractTwo =  await LibraryContractFactory.deploy();
            this.target = await ContractFactory.deploy(LibraryContractOne.address, LibraryContractTwo.address);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).to.be.eq(attacker.address);
    });
});