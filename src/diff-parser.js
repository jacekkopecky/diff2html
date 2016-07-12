    /* Diff Header */
    var oldFileNameHeader = '--- ';
    var newFileNameHeader = '+++ ';
    var hunkHeaderPrefix = '@@';

    diffLines.forEach(function(line, lineIndex) {
      var prevLine = diffLines[lineIndex - 1];
      var nxtLine = diffLines[lineIndex + 1];
      var afterNxtLine = diffLines[lineIndex + 2];

      if (utils.startsWith(line, 'diff')) {
        startFile();
        currentFile.isGitDiff = true;
        return;
      }

      if (!currentFile || // If we do not have a file yet, we should crete one
          !currentFile.isGitDiff && currentFile && // If we already have some file in progress and
            utils.startsWith(line, oldFileNameHeader) && // If we get to an old file path header line
            // And is followed by the new file path header line and the hunk header line
            utils.startsWith(nxtLine, newFileNameHeader) && utils.startsWith(afterNxtLine, hunkHeaderPrefix)
       * We need to make sure that we have the three lines of the header.
       * This avoids cases like the ones described in:
       *   - https://github.com/rtfpessoa/diff2html/issues/87
      if (
        (utils.startsWith(line, oldFileNameHeader) &&
        utils.startsWith(nxtLine, newFileNameHeader) && utils.startsWith(afterNxtLine, hunkHeaderPrefix)) ||

        (utils.startsWith(line, newFileNameHeader) &&
        utils.startsWith(prevLine, oldFileNameHeader) && utils.startsWith(nxtLine, hunkHeaderPrefix))
      ) {

        /*
         * --- Date Timestamp[FractionalSeconds] TimeZone
         * --- 2002-02-21 23:30:39.942229878 -0800
         */
        if (currentFile && !currentFile.oldName &&
          utils.startsWith(line, '--- ') && (values = getSrcFilename(line, config))) {
          currentFile.oldName = values;
          currentFile.language = getExtension(currentFile.oldName, currentFile.language);
          return;
        }

        /*
         * +++ Date Timestamp[FractionalSeconds] TimeZone
         * +++ 2002-02-21 23:30:39.942229878 -0800
         */
        if (currentFile && !currentFile.newName &&
          utils.startsWith(line, '+++ ') && (values = getDstFilename(line, config))) {
          currentFile.newName = values;
          currentFile.language = getExtension(currentFile.newName, currentFile.language);
          return;
        }
      if (currentFile && utils.startsWith(line, hunkHeaderPrefix)) {