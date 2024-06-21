#!/usr/bin/env bash

set -eEuo pipefail

# Basic checks
if [ ! -d /backup ]; then
  echo "Error: No directory at /backup, make sure you bind a directory to this path when running this docker container" 1>&2
  exit 1
elif [ ! -e /backup/Manifest.db ]; then
  echo "Error: No manifest file at /backup/Manifest.db, make sure the backup directory you bind is at the correct level. The original directory name is usually a long hexidecimal string representing the device id." 1>&2
  exit 1
elif [[ "$(file -bi /backup/Manifest.db)" != application/vnd.sqlite3* ]]; then
  echo "Error: Manifest file does not appear to be valid. This can happen if you mounted an encrypted backup." 1>&2
  exit 1
fi

# Extract urls from each file in profile.profile/tab-session-data
tmp_dir="$(mktemp -d)"
/src/tab_file_extractor.js | while IFS= read -r tab_file_path; do
  if [ -z "$tab_file_path" ]; then
    # Ignore empty lines
    true
  elif [ "$(head -c 10 /backup/Manifest.db | base64)" = "$(echo -e "\0\0\0\x02bplist" | base64)" ]; then
    echo "Error: Cannot parse the tab data file $tab_file_path" 1>&2
  else
      # First 4 bytes need to be removed to make a valid bplist file
    tail -c +5 "/backup/$tab_file_path" > "$tmp_dir/stripped_data"
    /src/url_extractor.js "$tmp_dir/stripped_data" || echo "Error: Could not process tab file at $tab_file_path"
  fi
done

rm -rf "$tmp_dir"
