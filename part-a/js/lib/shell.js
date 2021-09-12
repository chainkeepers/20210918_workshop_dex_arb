const { execSync } = require('child_process');


function shell(cmd) {
  console.log(`(shell) spawning: ${cmd}`);
  return execSync(
    cmd,
    (error, stdout, stderr) => {
      if(error){
        console.log(`compression failed ${error.message}`);
        return;
      }
      if(stderr){
        console.log(`${stderr}`);
        return;
      }
      console.log(stdout);
    }
  )
}


function xz(infile) {
  return shell(`xz '${infile}'`);
}


function xz_d(infile, outfile) {
  return shell(`xz -dc '${infile}' > '${outfile}'`);
}


function mv(src, dst) {
  return shell(`mv ${src} ${dst}`);
}


module.exports = {
  shell,
  xz, xz_d,
  mv,
};
