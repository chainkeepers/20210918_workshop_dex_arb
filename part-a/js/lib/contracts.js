const ethers = require('ethers');

const Erc20Abi = require('../artifacts/Erc20.json').abi;
const Erc20Interface = new ethers.utils.Interface(Erc20Abi);

const UniswapV2PairABI = require('@uniswap/v2-core/build/UniswapV2Pair.json').abi;
const UniswapV2PairInterface = new ethers.utils.Interface(UniswapV2PairABI);

const UniswapV3PairABI = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json').abi;
const UniswapV3PairInterface = new ethers.utils.Interface(UniswapV3PairABI);

const Curve3PoolABI = require('../artifacts/Curve3Pool.json');
const Curve3PoolInterface = new ethers.utils.Interface(Curve3PoolABI);

module.exports = {
  Erc20Interface,
  UniswapV2PairInterface,
  UniswapV3PairInterface,
  Curve3PoolInterface,
}
