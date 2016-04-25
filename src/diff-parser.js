  DiffParser.prototype.generateDiffJson = function(diffInput, configuration) {
    var config = configuration || {};

    var oldLine2 = null; // Used for combined diff
      /**
       * From Range:
       * -<start line>[,<number of lines>]
       *
       * To Range:
       * +<start line>[,<number of lines>]
       *
       * @@ from-file-range to-file-range @@
       *
       * @@@ from-file-range from-file-range to-file-range @@@
       *
       * number of lines is optional, if omited consider 0
       */

      if (values = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(line)) {
        oldLine = values[1];
        newLine = values[2];
      } else if (values = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(line)) {
        oldLine = values[1];
        oldLine2 = values[2];
        newLine = values[3];
        console.error("Failed to parse lines, starting in 0!");
        oldLine = 0;
        newLine = 0;
      currentBlock.oldStartLine2 = oldLine2;
    var copyFrom = /^copy from "?(.+)"?/;
    var copyTo = /^copy to "?(.+)"?/;
    var renameFrom = /^rename from "?(.+)"?/;
    var renameTo = /^rename to "?(.+)"?/;
    var index = /^index ([0-9a-z]+)\.\.([0-9a-z]+)\s*(\d{6})?/;
    var combinedIndex = /^index ([0-9a-z]+),([0-9a-z]+)\.\.([0-9a-z]+)/;
    var combinedMode = /^mode (\d{6}),(\d{6})\.\.(\d{6})/;
      } else if (currentFile && !currentFile.oldName && (values = getSrcFilename(line, config))) {
        currentFile.oldName = values;
      } else if (currentFile && !currentFile.newName && (values = getDstFilename(line, config))) {
        currentFile.newName = values;
        currentFile.isDeleted = true;
        currentFile.isNew = true;
        values[3] && (currentFile.mode = values[3]);
        currentFile.isNew = true;
        currentFile.isDeleted = true;
  function getSrcFilename(line, cfg) {
    var prefixes = ["a/", "i/", "w/", "c/", "o/"];

    if (cfg.srcPrefix) {
      prefixes.push(cfg.srcPrefix);
    }

    return _getFilename('---', line, prefixes);
  }

  function getDstFilename(line, cfg) {
    var prefixes = ["b/", "i/", "w/", "c/", "o/"];

    if (cfg.dstPrefix) {
      prefixes.push(cfg.dstPrefix);
    }

    return _getFilename('\\+\\+\\+', line, prefixes);
  }

  function _getFilename(linePrefix, line, prefixes) {
    var FilenameRegExp = new RegExp('^' + linePrefix + ' "?(.+?)"?$');

    var filename;
    var values = FilenameRegExp.exec(line);
    if (values && values[1]) {
      filename = values[1];
      var matchingPrefixes = prefixes.filter(function(p) {
        return filename.indexOf(p) === 0;
      });

      if (matchingPrefixes[0]) {
        // Remove prefix if exists
        filename = filename.slice(matchingPrefixes[0].length);
      }
    }

    return filename;
  }
