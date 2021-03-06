var nconf = require('nconf'),
    app = require('./lib');

var conf = __dirname+'/conf.json';

if(require('fs').existsSync(conf)){
  nconf.file({file: conf});
  var observe_folder = nconf.get('folder');
  var opt = {
    ignore: nconf.get('ignore') || [],
    only: nconf.get('only') || []
  };
  
  if(observe_folder){
    app.run(observe_folder,opt);
  }else{
    console.log([
    '\033[31m',
    '[Exit]: need `folder` value',
    '\033[39m'
    ].join(''));
    process.exit();
  }
  
}else{

  console.log([
    '\033[31m',
    '[Exit]: conf.json not found',
    '\033[39m'
  ].join(''));
  process.exit();
  
}

