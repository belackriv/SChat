SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  transpiler: "plugin-babel",
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "backbone": "npm:backbone@1.3.1",
    "backbone-metal": "github:marionettejs/backbone-metal@0.5.0",
    "backbone-metal-classify": "github:thejameskyle/backbone-metal-classify@1.1.0",
    "backbone-normalize-hash": "github:thejameskyle/backbone-normalize-hash@1.0.0",
    "backbone.babysitter": "github:marionettejs/backbone.babysitter@0.1.10",
    "backbone.radio": "github:marionettejs/backbone.radio@1.0.2",
    "backbone.service": "github:thejameskyle/backbone.service@0.5.1",
    "backbone.wreqr": "github:marionettejs/backbone.wreqr@1.3.5",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.20",
    "es6-promise": "npm:es6-promise-polyfill@1.2.0",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "handlebars": "github:components/handlebars.js@4.0.5",
    "hbs": "github:davis/plugin-hbs@master",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "jquery": "github:components/jquery@2.2.1",
    "jquery-ui": "github:components/jqueryui@1.11.4",
    "marionette": "github:marionettejs/backbone.marionette@2.4.4",
    "module": "github:jspm/nodelibs-module@0.2.0-alpha",
    "moment": "github:moment/moment@2.11.2",
    "net": "github:jspm/nodelibs-net@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.8",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
    "underscore": "npm:underscore@1.8.3",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha"
  },

  packages: {
    "github:components/jqueryui@1.11.4": {
      "map": {
        "jquery": "npm:jquery@2.2.1"
      }
    },
    "github:davis/plugin-hbs@master": {
      "map": {
        "handlebars": "github:components/handlebars.js@4.0.5"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.5.0"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.2.0"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:twbs/bootstrap@3.3.6": {
      "map": {
        "jquery": "github:components/jquery@2.2.1"
      }
    },
    "npm:backbone@1.3.1": {
      "map": {
        "underscore": "npm:underscore@1.8.3"
      }
    },
    "npm:buffer@4.5.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.1",
        "ieee754": "npm:ieee754@1.1.6",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:core-js@1.2.6": {
      "map": {
        "systemjs-json": "github:systemjs/plugin-json@0.1.0"
      }
    },
    "npm:readable-stream@2.0.5": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@0.0.1",
        "process-nextick-args": "npm:process-nextick-args@1.0.6",
        "string_decoder": "npm:string_decoder@0.10.31",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.0.5"
      }
    },
    "npm:stream-http@2.2.0": {
      "map": {
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "inherits": "npm:inherits@2.0.1",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    }
  }
});
