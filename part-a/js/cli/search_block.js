const provider = require('../lib/network').homestead;



async function main(args){

  const data = await provider.getBlock(args.block);

  for(tx of data.transactions){
    const tx_data = await provider.getTransaction(tx);
    const tx_input = tx_data.data;

    if(tx_input == args.input)
      console.log(JSON.stringify(tx_data));
  }

  process.exit(0);
}


require('yargs')
  .command(
    '$0 block input',
    'serches transactions in a block for specific input',
    (yargs) => {
      yargs
        .positional('block', {
          describe: 'block to search in',
        })
        .positional('input', {
          describe: 'input to search for',
          type: 'string',
        })
    }, main)
  .argv;
