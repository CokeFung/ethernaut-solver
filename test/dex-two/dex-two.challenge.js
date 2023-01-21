const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] DexTwo', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const DexFactory = await ethers.getContractFactory('DexTwo');
            const SwappableTokenFactory = await ethers.getContractFactory('SwappableTokenTwo');
            this.target = DexFactory.attach("");
            this.token1 = SwappableTokenFactory.attach(await this.target.token1());
            this.token2 = SwappableTokenFactory.attach(await this.target.token2());
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const DexFactory = await ethers.getContractFactory('DexTwo', deployer);
            const SwappableTokenFactory = await ethers.getContractFactory('SwappableTokenTwo', deployer);
            this.target = await DexFactory.deploy();
            this.token1 = await SwappableTokenFactory.deploy(this.target.address, "Token 1", "TKN1", 110); // 100 for dex, 10 for attacker
            this.token2 = await SwappableTokenFactory.deploy(this.target.address, "Token 2", "TKN2", 110); // 100 for dex, 10 for attacker
            /** set token for dex contract **/
            let setokenTX = await this.target.connect(deployer).setTokens(this.token1.address, this.token2.address); await setokenTX.wait();
            /** send tokens to dex **/
            let approveTX = await this.target.connect(deployer).approve(this.target.address, 100); await approveTX.wait();
            let addToken1TX = await this.target.connect(deployer).add_liquidity(this.token1.address, 100); await addToken1TX.wait();
            let addToken2TX = await this.target.connect(deployer).add_liquidity(this.token2.address, 100); await addToken2TX.wait();
            /** send tokens to attacker **/
            let sendToken1TX = await this.token1.connect(deployer).transfer(attacker.address, 10); await sendToken1TX.wait();
            let sendToken2TX = await this.token2.connect(deployer).transfer(attacker.address, 10); await sendToken2TX.wait();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(0).to.be.eq(parseInt(await this.token1.balanceOf(this.target.address)));
        expect(0).to.be.eq(parseInt(await this.token2.balanceOf(this.target.address)));
    });
});