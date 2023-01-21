const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Motorbike', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const MotorbikeContractFactory = await ethers.getContractFactory('Motorbike');
            this.target = MotorbikeContractFactory.attach("");
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const EngineContractFactory = await ethers.getContractFactory('Engine', deployer);
            const MotorbikeContractFactory = await ethers.getContractFactory('Motorbike', deployer);
            this.engine = await EngineContractFactory.deploy();
            this.target = await MotorbikeContractFactory.deploy(this.engine.address);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await ethers.provider.getCode(this.engine.address)).to.be.eq("0x");
    });
});