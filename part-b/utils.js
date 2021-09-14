const { alchemy_endpoint } = require('./config.js');


async function pinBlock(number) {
  await network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: alchemy_endpoint,
          blockNumber: number,
        },
      },
    ],
  });
}


async function impersonate(who) {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [who],
  });
  return await ethers.getSigner(who);
}


async function getERC20(address) {
  return await ethers.getContractAt(
    '@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20',
    address
  );
}


/* Bware, that keys have to be lower-case. */
const tokenHolders = {
  /* WETH is in WETH */
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};
const BINANCE_ADDRESS = '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE';


async function sendTokens(sendToAddr, amount, tokenAddr) {
  const tokenAddrLower = tokenAddr.toLowerCase();
  const holder = tokenAddrLower in tokenHolders
        ? tokenHolders[tokenAddrLower]
        : BINANCE_ADDRESS;
  const holderSigner = await impersonate(holder);
  token = await getERC20(tokenAddr);
  const holderBalance = await token.balanceOf(holder);

  if (holderBalance < amount)
    throw `${holder} has too few ${tokenAddr}`;

  await token.connect(holderSigner).transfer(sendToAddr, amount, {gasPrice: 0});

  await token.balanceOf(holder);
}


module.exports = {
  pinBlock,
  impersonate,
  sendTokens,
}
