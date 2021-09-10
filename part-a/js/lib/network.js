const ethers = require('ethers')

const alchemy_key = 'cQ7eqtboeO428yWiVB-Qu_4gdBF-Wp-J'

const homestead = new ethers.providers.AlchemyProvider('homestead', alchemy_key)

module.exports = { homestead }
