const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] GatekeeperTwo', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('GatekeeperTwo');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('GatekeeperTwo', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const GatekeeperTwoSolverFactory = await ethers.getContractFactory('GatekeeperTwoSolver', attacker);
        const GatekeeperTwoSolver = await GatekeeperTwoSolverFactory.deploy(
            this.target.address, 
            {gasLimit: 200000} // 200K is enough?
        );
        console.log(`\t entrant: ${await this.target.entrant()}`);
        await GatekeeperTwoSolver.waiting();
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.entrant()).to.be.eq(attacker.address);
    });
});