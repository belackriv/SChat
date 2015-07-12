'use strict';

import Backbone from 'backbone';
import Radio from 'backbone.radio';
import Marionette from 'marionette';
import './shims/marionette.radio.shim';
import AppLayout from './app_layout_view';
import NavbarView from './navbar/view';
import ChatLayout from './chat/layout';

if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}

export default Marionette.Application.extend({
  initialize(options){
    this.layout = new AppLayout();
    this.layout.render();
    this.layout.showChildView('navbar', new NavbarView({model: new Backbone.Model()}));
    this.layout.showChildView('main', new ChatLayout({
      channelCollection: options.channelCollection
    }));
  },
  navigate(route,  options){
    options = options ||  {};
    Backbone.history.navigate(route, options);
  },
  getCurrentRoute(){
    return Backbone.history.fragment;
  },
  onStart(){
    if(Backbone.history){
      var routeFound = Backbone.history.start({pushState: true});
      console.log('starting route "'+this.getCurrentRoute()+'" found: '+routeFound);
    }
  }
});
