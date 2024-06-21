#!/usr/bin/env node

// This file reads newline-separated file ids from stdin and outputs the current tab url from each of the corresponding files

const yargs = require('yargs');
const bplist = require('bplist-parser');

const backupPath = '/tmp/stripped';

const argv = yargs
  .usage('Usage: $0 <filePaths...>')
  .demandCommand(1, 'You need to provide at least one file path')
  .argv;

const filePaths = argv._;

// Function to read the file
(async () => {
  for (const filePath of filePaths) {
    const obj = await bplist.parseFile(filePath);

    // Skip empty tabs
    if (!Object.hasOwn(obj[0]["SessionHistory"], "SessionHistoryEntries")) { continue; }

    const entry = obj[0]["SessionHistory"]["SessionHistoryEntries"][obj[0]["SessionHistory"]["SessionHistoryCurrentIndex"]];
    // Can also read entry["SessionHistoryEntryTitle"] if you want, it is often blank however
    console.log(entry["SessionHistoryEntryURL"]);
  }
})();
