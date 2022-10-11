"use strict";

var _server = require("./server");

const port = parseInt(process.env.PORT) || 8080;
(0, _server.launch)(port);