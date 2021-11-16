import chai, { expect } from "chai";
import { Signer, Wallet } from "ethers"
import { ethers, waffle , network} from "hardhat";
import { Provider } from "web3/providers";
import { deployTestToken} from "./helpers/deploy";
import { getUSDCSigner, erc20, formatUSDC, parseUSDC, skipTimeDays } from './helpers/helpers';
import { TestToken } from "@typechain/TestToken";
import { ERC20 } from "@typechain/ERC20";

// Still have to declare module
import { BN, constants, expectEvent, expectRevert } from '@openzeppelin/test-helpers';
const { ZERO_ADDRESS } = constants;

const name = 'TestToken';
const symbol = 'TST';
const cap = 1_000_000;

const initialSupply = 0;

describe("Deploy Token Contract", async () => {
  let testToken: TestToken, owner: Signer, recipient: Signer, USDCSigner: Signer, erc20USDC: ERC20;

  beforeEach(async () => {
    [owner, recipient] = await ethers.getSigners();
    testToken = await deployTestToken(owner, name, symbol, cap);

    // console.log(testToken)
  });

  it('has a name', async function () {
    expect(await testToken.name()).to.equal(name);
  });

  it('has a symbol', async function () {
    expect(await testToken.symbol()).to.equal(symbol);
  });

  it('has 18 decimals', async function () {
    expect(await testToken.decimals()).to.equal(18);
  });

  describe('Minting tokens', function () {
    const amount = 100_000;

    beforeEach('minting', async function () {
      const logs = await testToken.mint(await recipient.getAddress(), amount);
    });

    it('increments totalSupply', async function () {
      const expectedSupply = initialSupply + amount;
      expect(await testToken.totalSupply()).to.equal(expectedSupply);
    });

    it('increments recipient balance', async function () {
      expect(await testToken.balanceOf(await recipient.getAddress())).to.equal(amount);
    });

    it('cannot mint more then cap', async function () {
      await expectRevert(
        await testToken.mint(await recipient.getAddress(), cap),
        'ERC20Capped: cap exceeded',
      );
    });

  });
});