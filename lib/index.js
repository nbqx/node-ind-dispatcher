var Watcher = require('./watch'),
    InDesignWritableStream = require('./indesign_writable_stream'),
    fs = require('fs');

exports.run = function(folder){
  var observed = folder;
  var watch = new Watcher(observed, {
    ignore: ['.DS_Store'],
    only: ['.jsx$']
  });

  var when_add_or_change = function(file){
    var jsx = fs.createReadStream(file);
    var ind = new InDesignWritableStream();

    ind.on('error',function(x_x){
      
      console.log([
        '\033[31m',
        '[Error]: ',
        '\033[39m',
        Date().toString(),
        ' - ',
        x_x.toString()
      ].join(''));

      fs.unlink(jsx.path,function(err){
        if(err) console.err(err)
      });
      
    });
    
    ind.on('finish',function(){
      
      console.log([
        '\033[32m',
        '[Success]: ',
        '\033[39m',
        Date().toString(),
        ' - ',
        jsx.path
      ].join(''));
      
      fs.unlink(jsx.path,function(err){
        if(err) console.err(err)
      });
      
    });

    jsx.pipe(ind);
  };

  watch.start(when_add_or_change);

  console.log([
    '\033[32m',
    'Starting Ind-Dispatcher: ',
    '\033[39m',
    'Observing "',
    require('path').resolve(observed),
    '" Now...'
  ].join(''));

};
