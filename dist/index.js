"use strict"; Object.defineProperty(exports,"__esModule",{ value: true }); var _components = require("@gcommands/components"); Object.keys(_components).forEach(key => { if (key === "default" || key === "__esModule") return; if (key in exports && exports[key] === _components[key]) return; Object.defineProperty(exports,key,{ enumerable: true,get: function() { return _components[key]; } }); }); var _events = require("@gcommands/events"); Object.keys(_events).forEach(key => { if (key === "default" || key === "__esModule") return; if (key in exports && exports[key] === _events[key]) return; Object.defineProperty(exports,key,{ enumerable: true,get: function() { return _events[key]; } }); }); var _GCommandsClient = require("./base/GCommandsClient"); Object.keys(_GCommandsClient).forEach(key => { if (key === "default" || key === "__esModule") return; if (key in exports && exports[key] === _GCommandsClient[key]) return; Object.defineProperty(exports,key,{ enumerable: true,get: function() { return _GCommandsClient[key]; } }); });
