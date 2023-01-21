const { ethers } = require('hardhat');
const { expect } = require('chai');
const ether = require('openzeppelin-test-helpers/src/ether');

describe('[Challenge] PuzzleWallet', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const PuzzleProxyContractFactory = await ethers.getContractFactory('PuzzleProxy');
            const PuzzleWalletContractFactory = await ethers.getContractFactory('PuzzleWallet')
            this.target = PuzzleProxyContractFactory.attach("");
            let implementationAddress = await ethers.provider.getStorageAt(
                this.target.address, 
                "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
            );
            this.implement = PuzzleWalletContractFactory.attach(implementationAddress);
            this.targetImplementation = PuzzleWalletContractFactory.attach(this.target.address);
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const PuzzleProxyContractFactory = await ethers.getContractFactory('PuzzleProxy', deployer);
            const PuzzleWalletContractFactory = await ethers.getContractFactory('PuzzleWallet', deployer);
            this.implement = await PuzzleWalletContractFactory.deploy();
            let ABI = ["function init(uint256 _maxBalance)"];
            let iface = new ethers.utils.Interface(ABI);
            let data = iface.encodeFunctionData("init", [ethers.utils.parseEther("1", "ether")]);
            this.target = await PuzzleProxyContractFactory.deploy(deployer.address, this.implement.address, data);
            this.target.proposeNewAdmin(deployer.address);
            this.targetImplementation = PuzzleWalletContractFactory.attach(this.target.address);
            await this.targetImplementation.addToWhitelist(deployer.address);
            await this.targetImplementation.deposit({value:ethers.utils.parseEther("0.001", "ether")});
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.admin()).to.be.eq(attacker.address);
    });
});