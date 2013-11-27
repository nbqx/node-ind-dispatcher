var Writable = require('stream').Writable,
    TmpFile = require('temporary').File,
    exec = require('child_process').exec,
    util = require('util');

util.inherits(InDesignWritableStream, Writable);

function InDesignWritableStream(opt){
  var self = this;
  self.cmd = ['osascript'];
  self.jsx = new TmpFile();
  self.scpt = new TmpFile();
  
  Writable.call(self, opt);
};

InDesignWritableStream.prototype._write = function(data,encoding,done){
  var self = this;
  self.jsx.writeFileSync(data);

  var script = [
    "tell application \"Adobe InDesign CS5\"",
    "  with timeout (1 * 60 * 60) seconds",
    "    do script \"$.evalFile('"+self.jsx.path+"');\" language javascript",
    "  end timeout",
    "end tell"
  ].join("\n");
  self.scpt.writeFileSync(script);

  self.cmd.push(self.scpt.path);
  var cmd = self.cmd.join(' ');
  
  exec(cmd, function(err,stdout,stderr){
    if(err) return done(err);
    if(stderr) console.log(stderr);
    if(stdout) console.log(stdout);
    
    self.jsx.unlink();
    self.scpt.unlink();
    
    done();
  });
  
};

module.exports = InDesignWritableStream;

