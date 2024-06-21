# Firefox for iOS Tab Recovery

*Disclaimer: This is not an official tool and is in no way affiliated with Firefox, the Mozilla Foundation, or any of its subsidiaries*

This repository contains a small dockerized Node.js tool to extract a list of open tabs from a local iOS backup. This was tested and works with a backup from Firefox 1.126.2, but may not work with backups from older versions of Firefox due to a change to the tab storage method, which happened around v1.114.

## Setup

To use this tool you must have a local (not iCloud†) backup of your iOS device. If you are doing this to recovery tabs lost by some Mozilla fuck-up (exhibits: [1](https://github.com/mozilla-mobile/firefox-ios/issues/15989) [2](https://github.com/mozilla-mobile/firefox-ios/issues/20073)), the backup needs to have been made before the tabs were lost. If you just want to transfer all your currently open tabs, you can make a new backup any time. If using iTunes, follow [this guide](https://support.apple.com/en-gb/HT204215) to locate your backup directory.

The backup also needs to be decrypted. If your backup is encrypted, you will need to decrypt it first before it can be used with this tool. There are tools out there to do this, we recommend [mvt](https://docs.mvt.re/en/stable/ios/backup/check/#decrypting-a-backup). If you don't know if your backup is encrypted, you can try running the recovery tool and see if it gives you an error.

† I have no experience with iCloud backups. If it's possible to download the raw backup data you may be able to get it to work with this tool. Alternatively, you may be able to restore from the iCloud backup, and then make a local backup with the restored device.

## Using this tool

The recommended way to use this tool is as a docker container. First clone/download this repository and build the docker image by running `docker build -t firefox-ios-tab-recovery:latest .` from the root directory of this repo.

Once your docker image has been built, run it with this command:
```bash
docker run --rm -v '<backup>':/backup firefox-ios-tab-recovery
```
replacing `<backup>` with the path to your unencrypted backup directory (the directory contain the Manifest.db file). If everything works, all tabs (private and regular) that can be found will be printed to the standard output, one per line.

## Acknowledgements

This tool would not have been possible without [bplist-parser](https://github.com/nearinfinity/node-bplist-parser). [libimobiledevice](https://libimobiledevice.org/) and [mvt](https://docs.mvt.re/en/stable/) also deserve mention as invaluable tools for working with iOS backups.
