var sep  = require('path').sep;
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

  paths.forEach(function(path) {
    if (!fs.existsSync(path)) {
      throw new Error('No such file or directory: ' + path);
    } else if (fs.statSync(path).isFile()) {
      return results.push(path);
    }

    file.walkSync(path, function(dirPath, dirs, files) {
      files.forEach(function(file) {
        var filePath;

        if (opts.suffix && file.slice(-opts.suffix.length) !== opts.suffix) {
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
