/* Downloads
   1. chainlink price update events
   2. initiating transactions from and to
   3. aave reserve prices before at and after the block where updates are observed
*/

const { isEmpty, some } = require('lodash');

const make_sink = require('../lib/streams').make_sink;
const provider = require('../lib/network').homestead;
const {
  Erc20Interface,
  UniswapV2PairInterface,
  UniswapV3PairInterface,
  Curve3PoolInterface,
} = require('../lib/contracts');

const CHUNK = 500;
const STEP = 10;
const NAME = 'collect_arbitrage'

const CURVE_3POOL_ADDRESS = '0x5F890841f657d90E081bAbdB532A05996Af79Fe6';


function build_record(entry, event) {
  const record = {
    blockNumber: entry.blockNumber,
    transactionIndex: entry.transactionIndex,
    transactionHash: entry.transactionHash,
    logIndex: entry.logIndex,
    removed: entry.removed,
    name: event.name,
    address: entry.address,
  };

  for(k in event.args)
    if(!(k in ['0', '1', '2', '3', '4', '5', '6']))
      record[k] = event.args[k];

  return record;
}


function parse_uni2_event(entry) {
  try{

    if(entry.removed)
      return;

    const event = UniswapV2PairInterface.parseLog(entry);

    // Only parse Uniswap V2 Swap events.
    if(event.signature != 'Swap(address,uint256,uint256,uint256,uint256,address)')
      return;

    return build_record(entry, event);

  }catch(err){
    if(
      (err.reason == 'no matching event')
        || (err.reason = 'data out-of-bounds')
    ){
      return;
    }else{
      console.log('ERROR');
      console.log(err);
    }
  }
}


function parse_uni3_event(entry) {
  try{

    if(entry.removed)
      return;

    const event = UniswapV3PairInterface.parseLog(entry);

    // Only parse Uniswap V3 Swap events.
    if(event.signature != 'Swap(address,address,int256,int256,uint160,uint128,int24)')
      return;

    return build_record(entry, event);

  }catch(err){
    if(
      (err.reason == 'no matching event')
        || (err.reason = 'data out-of-bounds')
    ){
      return;
    }else{
      console.log('ERROR');
      console.log(err);
    }
  }
}


function parse_curve_event(entry) {
  try{

    if(entry.removed)
      return;

    const event = Curve3PoolInterface.parseLog(entry);

    // Only parse Curve Swap events.
    if(
      (event.signature != 'TokenExchange(address,int128,uint256,int128,uint256)')
        //|| (entry.address != CURVE_3POOL_ADDRESS)
    )
      return;

    return build_record(entry, event);

  }catch(err){
    if(
      (err.reason == 'no matching event')
        || (err.reason = 'data out-of-bounds')
    ){
      return;
    }else{
      console.log('ERROR');
      console.log(err);
    }
  }
}


function parse_transfer_event(entry) {
  try{

    if(entry.removed)
      return;

    const event = Erc20Interface.parseLog(entry);

    // Only parse Transfer events.
    if(event.name != 'Transfer')
      return;

    return build_record(entry, event);

  }catch(err){
    if(
      (err.reason == 'no matching event')
        || (err.reason = 'data out-of-bounds')
    ){
      return;
    }else{
      console.log('ERROR');
      console.log(err);
    }
  }
}


const processed = new Set()
async function process_transaction_once(hash) {
  if(processed.has(hash))
    return;

  console.log(`processing transaction ${hash}`);

  const tx = await provider.getTransaction(hash);
  const tx_rec = await provider.getTransactionReceipt(hash);

  const record = {
    blockNumber: tx.blockNumber,
    transactionIndex: tx.transactionIndex,
    transactionHash: hash,
    from: tx.from,
    to: tx.to,
    gasLimit: tx.gasLimit,
    gasPrice: tx.gasPrice,
    gasUsed: tx_rec.gasUsed,
    input: tx.data,
    value: tx.value,
    nonce: tx.nonce,
  };

  processed.add(hash);
  return record;
}


const PROFIT_BLACKLIST = [
  '0x11111112542D85B3EF69AE05771c2dCCff4fAa26', // 1inch V3 Router
  '0xDEa4F7D58Ceb43254CE0E1015367636d2392a22c', // 0x Exchange Proxy
  '0xDef1C0ded9bec7F1a1670819833240f027b25EfF', // 0x Exchange Proxy
  '0x881D40237659C251811CEC9c364ef91dC08D300C', // Metamask router
];


function calculate_profit(own_addresses, transfers) {
  const balances = new Map();

  // Some arbitrages are unimplemented.
  for(const addr of PROFIT_BLACKLIST)
    if(own_addresses.has(addr))
      return;

  for(const transfer of transfers){

    let sign = 0;
    if(own_addresses.has(transfer.from))
      sign -= 1;
    if(own_addresses.has(transfer.to))
      sign += 1;

    const addr = transfer.address;
    const balance = balances.get(addr) ?? 0;
    balances.set(addr, balance + sign * transfer.value);

  }

  weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  for(const [token, balance] of balances)
    if((token != weth) && balance > 0)
      return;

  return balances.get(weth);
}

async function collect(first_block, last_block, sink) {
  let last_block_seen = 0;

  for(let start=first_block; start < last_block; start += STEP){

    let stop = start + STEP - 1;
    if(stop > last_block)
      stop = last_block;

    console.log(`collecting logs from ${start} to ${stop}`);

    const logs = await provider.getLogs({fromBlock: start, toBlock: stop});

    let curve_records = [];
    let uni2_records = [];
    let uni3_records = [];
    let transfer_records = [];

    let last_tx_hash;
    for(const entry of logs){

      if(last_tx_hash != entry.transactionHash){
        let n_swaps = 0;
        n_swaps += !isEmpty(uni2_records);
        n_swaps += !isEmpty(uni3_records);
        n_swaps += !isEmpty(curve_records);
        if(n_swaps > 1){
          // If the logs contain both Uniswap V2 and Curve 3Pool swaps.

          for(const record of curve_records)
            await sink.event(record);

          for(const record of uni2_records)
            await sink.event(record);

          for(const record of uni3_records)
            await sink.event(record);

          const tx_record = await process_transaction_once(last_tx_hash);

          tx_record['profit'] = calculate_profit(new Set([tx_record.from, tx_record.to]), transfer_records);

          if(tx_record)
            await sink.tx(tx_record);
        }

        curve_records = [];
        uni2_records = [];
        uni3_records = [];
        transfer_records = [];

        last_tx_hash = entry.transactionHash;

      }

      const curve_event = parse_curve_event(entry);
      if(curve_event)
        curve_records.push(curve_event);

      const uni2_event = parse_uni2_event(entry);
      if(uni2_event)
        uni2_records.push(uni2_event);

      const uni3_event = parse_uni3_event(entry);
      if(uni3_event)
        uni3_records.push(uni3_event);

      const transfer_event = parse_transfer_event(entry);
      if(transfer_event)
        transfer_records.push(transfer_event);
    }
  }
}


async function main() {
  const last_block = (await provider.getBlock()).number;
  const last_chunk_block = Math.floor(last_block / CHUNK) * CHUNK - 1;
  const first_chunk_block = last_chunk_block - CHUNK + 1;

  const tmp_dir = `tmp/${NAME}/${first_chunk_block}-${last_chunk_block}`;
  const out_dir = `data/${NAME}/${first_chunk_block}-${last_chunk_block}`;

  const sink = {
    event: make_sink(out_dir, tmp_dir, 'events'),
    tx: make_sink(out_dir, tmp_dir, 'txs'),
  };

  await collect(first_chunk_block, last_chunk_block, sink);

  await sink.event.end();
  await sink.tx.end();

  process.exit(0);
}


main();
