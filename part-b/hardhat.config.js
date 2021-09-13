require('@nomiclabs/hardhat-waffle');
const alchemy_key = 'cQ7eqtboeO428yWiVB-Qu_4gdBF-Wp-J'
const alchemy_endpoint =
  'https://eth-mainnet.alchemyapi.io/v2/'+alchemy_key;
// const homestead = new ethers.providers.AlchemyProvider('homestead', alchemy_key)

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    local: {
      /// First please start it with
      ///   npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/cQ7eqtboeO428yWiVB-Qu_4gdBF-Wp-J
      url: 'http://127.0.0.1:8545', // This should match the output there.
      timeout: 60000,
    },
    goerli: {
      url: 'https://rpc.goerli.mudit.blog',
    },
  },
  defaultNetwork: 'local',
};
