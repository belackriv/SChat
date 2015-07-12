'use strict';

import Marionette from 'marionette';
import appLayoutTpl from './app_layout.hbs!';
import Radio from 'backbone.radio';

export default Marionette.LayoutView.extend({
  template: appLayoutTpl,
  el: "body",
  regions: {
    navbar: "nav",
    header: "header",
    main: "#main-section",
    footer: 'footer'
  }
});


    
