SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.35",
    "babel-runtime": "npm:babel-runtime@5.8.35",
    "backbone": "npm:backbone@1.3.1",
    "backbone-metal": "github:marionettejs/backbone-metal@0.5.0",
    "backbone-metal-classify": "github:thejameskyle/backbone-metal-classify@1.1.0",
    "backbone-normalize-hash": "github:thejameskyle/backbone-normalize-hash@1.0.0",
    "backbone.babysitter": "github:marionettejs/backbone.babysitter@0.1.10",
    "backbone.radio": "github:marionettejs/backbone.radio@1.0.2",
    "backbone.service": "github:thejameskyle/backbone.service@0.5.1",
    "backbone.wreqr": "github:marionettejs/backbone.wreqr@1.3.5",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.20",
    "es6-promise": "npm:es6-promise-polyfill@1.2.0",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "handlebars": "github:components/handlebars.js@4.0.5",
    "hbs": "github:davis/plugin-hbs@master",
    "jquery": "github:components/jquery@2.2.1",
    "jquery-ui": "github:components/jqueryui@1.11.4",
    "marionette": "github:marionettejs/backbone.marionette@2.4.4",
    "moment": "github:moment/moment@2.11.2",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "underscore": "npm:underscore@1.8.3"
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
    "github:twbs/bootstrap@3.3.6": {
      "map": {
        "jquery": "github:components/jquery@2.2.1"
      }
    },
    "npm:babel-runtime@5.8.35": {
      "map": {}
    },
    "npm:backbone@1.3.1": {
      "map": {
        "underscore": "npm:underscore@1.8.3"
      }
    },
    "npm:core-js@1.2.6": {
      "map": {
        "systemjs-json": "github:systemjs/plugin-json@0.1.0"
      }
    }
  }
});
