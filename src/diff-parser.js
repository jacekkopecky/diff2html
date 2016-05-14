    /* Add previous block(if exists) before start a new file */
    /*
     * Add previous file(if exists) before start a new one
     * if it has name (to avoid binary files errors)
     */
    /* Create file structure */
      if (
        utils.startsWith(line, 'diff') || // Git diffs always start with diff
        !currentFile || // If we do not have a file yet, we should crete one
        (
          currentFile && // If we already have some file in progress and
          (
            currentFile.oldName && utils.startsWith(line, '---') || // Either we reached a old file identification line
            currentFile.newName && utils.startsWith(line, '+++')  // Or we reached a new file identification line
          )
        )
      ) {
      }

      var values;

      /*
       * --- Date Timestamp[FractionalSeconds] TimeZone
       * --- 2002-02-21 23:30:39.942229878 -0800
       */
      if (currentFile && !currentFile.oldName &&
        utils.startsWith(line, '---') && (values = getSrcFilename(line, config))) {
        return;
      }

      /*
       * +++ Date Timestamp[FractionalSeconds] TimeZone
       * +++ 2002-02-21 23:30:39.942229878 -0800
       */
      if (currentFile && !currentFile.newName &&
        utils.startsWith(line, '+++') && (values = getDstFilename(line, config))) {
        return;
      }

      if (currentFile && utils.startsWith(line, '@')) {
        return;
      }

      /*
       * There are three types of diff lines. These lines are defined by the way they start.
       * 1. New line     starts with: +
       * 2. Old line     starts with: -
       * 3. Context line starts with: <SPACE>
       */
      if (currentBlock && (utils.startsWith(line, '+') || utils.startsWith(line, '-') || utils.startsWith(line, ' '))) {
        createLine(line);
        return;
      }

      if (
        (currentFile && currentFile.blocks.length) ||
        (currentBlock && currentBlock.lines.length)
      ) {
        startFile();
      }

      /*
       * Git diffs provide more information regarding files modes, renames, copies,
       * commits between changes and similarity indexes
       */
      if ((values = oldMode.exec(line))) {