var nodePath = require('path');
var sep  = nodePath.sep;
var fs   = require('fs');
var file = require('file');

exports.getSync = function(paths, opts) {
  var results, ignorePatterns, i;

  paths = paths || [];
  opts = opts || {};
  results = [];

  ignorePatterns = [];
  if (opts.ignore) {
    for (i = 0; i < opts.ignore.length; i++) {
      ignorePatterns.push(new RegExp(opts.ignore[i]));
    }
  }
  
  if (opts.suffix) {
    if (! Array.isArray(opts.suffix)) {
      opts.suffix = [opts.suffix];
    }
  } else {
    opts.suffix = [];
  }

  paths.forEach(function(path) {
    if (!fs.existsSync(path)) {
      throw new Error('No such file or directory: ' + path);
    } else if (fs.statSync(path).isFile()) {
      return results.push(path);
    }

    file.walkSync(path, function(dirPath, dirs, files) {
      files.forEach(function(file) {
        var filePath;
        var ext = nodePath.extname(file);

        if (opts.suffix.indexOf(ext) === -1) {
          return;
        }

        if (dirPath.slice(-1) !== sep) {
          dirPath += sep;
        }

        if (dirPath.indexOf(sep) !== 0 && dirPath.indexOf('.') !== 0) {
          dirPath = './' + dirPath;
        }

        filePath = dirPath + file;

        for (var i = 0; i < ignorePatterns.length; i++) {
          if (ignorePatterns[i].test(filePath)) return;
        }

        results.push(filePath);
      });
    });
  });

  return results;
};
