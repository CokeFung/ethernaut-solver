const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Denial', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId;
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Denial');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Denial', deployer);
            this.target = await ContractFactory.deploy();
            let sendTX = await deployer.sendTransaction({
                to: this.target.address,
                value: ethers.utils.parseEther("10", "ether")
            }); await sendTX.wait();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        // trying to withdraw
        const { solidity } = require('ethereum-waffle')
        const chai = require('chai');
        chai.use(solidity);
        chai.expect(await this.target.connect(attacker).withdraw()).to.be.reverted;
    });
});