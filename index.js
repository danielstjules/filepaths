var sep  = require('path').sep;
var fs   = require('fs');
var file = require('file');

exports.getSync = function(paths, opts) {
  var results = [];

  paths = paths || [];
  opts = opts || {};

  paths.forEach(function(path) {
    if (!fs.existsSync(path)) {
      throw new Error('No such file or directory: ' + path);
    } else if (fs.statSync(path).isFile()) {
      return results.push(path);
    }

    file.walkSync(path, function(dirPath, dirs, files) {
      files.forEach(function(file) {
        if (opts.suffix && file.slice(-opts.suffix.length) !== opts.suffix) {
          return;
        } else if (opts.ignore && dirPath.indexOf(opts.ignore) > -1) {
          return;
        }

        if (dirPath.slice(-1) !== sep) {
          dirPath += sep;
        }

        if (dirPath.indexOf(sep) !== 0 && dirPath.indexOf('.') !== 0) {
          dirPath = './' + dirPath;
        }

        results.push(dirPath + file);
      });
    });
  });

  return results;
};
