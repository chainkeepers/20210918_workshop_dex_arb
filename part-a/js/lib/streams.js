const fs = require('fs');
const { BigNumber } = require('ethers');
const { isObject } = require('lodash');
const { xz, mv } = require('../lib/shell');


function bignums_to_strings(record, levels = 10) {
  record = {...record};

  for(const i of Object.keys(record)){
    if(BigNumber.isBigNumber(record[i])){
      record[i] = record[i].toString();
    }else if(levels > 0 && isObject(record[i])){
      record[i] = bignums_to_strings(record[i], levels - 1);
    }
  }

  return record;
}


function make_sink(out_dir, tmp_dir, name) {
  const tmp_filename = `${tmp_dir}/${name}.jl`;
  const filename = `${out_dir}/${name}.jl.xz`;

  fs.mkdirSync(tmp_dir, {recursive: true});
  fs.mkdirSync(out_dir, {recursive: true});

  const stream = fs.createWriteStream(tmp_filename, function(err){if(err) throw err});
  console.log(`writing to ${tmp_filename}`);

  async function sink(record) {

    const data = JSON.stringify(bignums_to_strings(record));
    await stream.write(data);
    await stream.write('\n');
  }

  async function end(record) {
    await stream.end();
    xz(tmp_filename);
    mv(`${tmp_filename}.xz`, filename);
    console.log(`wrote ${filename}`);
  }

  sink.end = end;

  return sink;
}


module.exports = {
  make_sink,
  bignums_to_strings,
}
