System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.6.15",
    "babel-runtime": "npm:babel-runtime@5.6.15",
    "backbone": "npm:backbone@1.2.1",
    "backbone-metal": "github:marionettejs/backbone-metal@0.5.0",
    "backbone-metal-classify": "github:thejameskyle/backbone-metal-classify@1.0.1",
    "backbone-normalize-hash": "github:thejameskyle/backbone-normalize-hash@1.0.0",
    "backbone.babysitter": "github:marionettejs/backbone.babysitter@0.1.8",
    "backbone.radio": "github:marionettejs/backbone.radio@1.0.0",
    "backbone.service": "github:thejameskyle/backbone.service@0.5.1",
    "backbone.wreqr": "github:marionettejs/backbone.wreqr@1.3.3",
    "bootstrap": "github:twbs/bootstrap@3.3.5",
    "bootstrap-contextmenu": "github:sydcanem/bootstrap-contextmenu@0.3.3",
    "core-js": "npm:core-js@0.9.18",
    "css": "github:systemjs/plugin-css@0.1.13",
    "es6-promise": "npm:es6-promise-polyfill@1.0.0",
    "handlebars": "github:components/handlebars.js@3.0.3",
    "hbs": "github:davis/plugin-hbs@master",
    "jquery": "github:components/jquery@2.1.4",
    "marionette": "github:marionettejs/backbone.marionette@2.4.2",
    "underscore": "npm:underscore@1.8.3",
    "github:davis/plugin-hbs@master": {
      "handlebars": "github:components/handlebars.js@3.0.3"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:twbs/bootstrap@3.3.5": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:babel-runtime@5.6.15": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:backbone@1.2.1": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

