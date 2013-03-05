# WatchReload.js

This is closs blowser reloading application.

<hr>

### What is this?

This application returns contents which includes reloading script when specified files are modified.

### Requirements:

* nodejs
* socket.io
* nodejs opts module
* nodejs express module
* nodejs walk module

### Install:

$ node install

### Usage:

$ node server.js -h <your host> -f <response file>

or

$ sh ./process.sh, if you prepair node.sh witch includes above shell script.

### Options

* -h host (require): specifies host that provides socket.io.
* -f file (require): specifies response html file path.
* -b base path: specifies responese html's base path. If no specifies, this is to be host value.
* -d watch dir: specifies dir that is watched. If no specifies, this is tobe "./".

### Acknowledgement

http://anatoo.jp/watchreload/
