const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] King', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('King');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('King', deployer);
            this.target = await ContractFactory.deploy({value: ethers.utils.parseEther("0.1", "ether")});
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId;
        if (chainID == 1337){ // only for localnet
            // owner try to re-claim the throne
            try{
                let reclaimTX = await deployer.sendTransaction({
                    to:this.target.address, value:ethers.utils.parseEther("0.1", "ether"),
                    gasLimit: 200000
                }); await reclaimTX.wait();
            }catch(e){
                console.log(`\t Re-claiming the throne: ${e}`);
            } 
        }
        expect(await this.target._king()).to.be.eq(this.KingSolver.address);
    });
});