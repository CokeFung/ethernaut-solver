const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] DoubleEntryPoint', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId;
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const DoubleEntryPointTokenFactory = await ethers.getContractFactory('DoubleEntryPoint');
            const FortaFactory = await ethers.getContractFactory('Forta');
            const CryptoVaultFactory = await ethers.getContractFactory('CryptoVault');
            const LegacyTokenFactory = await ethers.getContractFactory('LegacyToken');
            this.DET = DoubleEntryPointTokenFactory.attach("");
            this.forta = FortaFactory.attach(await this.DET.forta());
            this.cryptoVault = CryptoVaultFactory.attach(await this.DET.cryptoVault());
            this.LGT = LegacyTokenFactory.attach(await this.DET.delegatedFrom());
            this.player = await this.DET.player();
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const initAmount = ethers.utils.parseEther('100', 'ether');
            const FortaFactory = await ethers.getContractFactory('Forta', deployer);
            this.forta = await FortaFactory.deploy();
            const CryptoVaultFactory = await ethers.getContractFactory('CryptoVault', deployer);
            this.cryptoVault = await CryptoVaultFactory.deploy(deployer.address);
            const LegacyTokenFactory = await ethers.getContractFactory('LegacyToken', deployer);
            this.LGT = await LegacyTokenFactory.deploy();
            let mintLGTTX = await this.LGT.connect(deployer).mint(this.cryptoVault.address, initAmount); await mintLGTTX.wait();
            const DoubleEntryPointTokenFactory = await ethers.getContractFactory('DoubleEntryPoint', deployer);
            this.DET = await DoubleEntryPointTokenFactory.deploy(
                this.LGT.address,
                this.cryptoVault.address,
                this.forta.address,
                attacker.address
            );
            let setTX = await this.cryptoVault.connect(deployer).setUnderlying(this.DET.address); await setTX.wait();
            let delegateTX = await this.LGT.connect(deployer).delegateToNewContract(this.DET.address); await delegateTX.wait();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        const { solidity } = require('ethereum-waffle')
        const chai = require('chai');
        chai.use(solidity);
        chai.expect(this.cryptoVault.connect(deployer).sweepToken(this.LGT.address)).to.be.revertedWith(
            "Alert has been triggered, reverting"
        );
    });
});