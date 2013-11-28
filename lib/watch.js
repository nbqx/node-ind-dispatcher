var _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

function Watcher(folder, opts){
  var self = this;
  self.path = path.resolve(folder);
  self.opts = opts || {ignore:[], only:[]};

  self.ignore_filter = (function(exc){
    var exclude = exc;
    return function(f){
      return !(_.contains(exclude,f));
    };
  })(self.opts.ignore);

  self.only_filter = (function(inc){
    var include = inc;
    return function(f){
      return _.some(include,function(x){
        return RegExp(x).test(f);
      });
    };
  })(self.opts.only);
  
  return self
};

Watcher.prototype.onAdded = function(fn){
  var self = this;
  self.on_added = fn;
  return self
};

Watcher.prototype.onModified = function(fn){
  return this.onAdded(fn);
};

Watcher.prototype.onRemoved = function(fn){
  var self = this;
  self.on_removed = fn;
  return self
};

Watcher.prototype.start = function(){
  var self = this;
  self.watcher = fs.watch(self.path, function(event,filename){
    
    if(self.ignore_filter(filename) && self.only_filter(filename)){
      var apath = path.join(self.path,filename);
      if(fs.existsSync(apath)){
        if(self.on_added!=undefined) self.on_added(apath);
      }
      else{
        if(self.on_removed!=undefined) self.on_removed(apath);
      }
    }
    
  });
  return self
};

Watcher.prototype.stop = function(){
  var self = this;
  self.watcher.close();
  process.exit();
};

module.exports = Watcher;
