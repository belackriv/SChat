'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	initialize(){
		if(this.get('roles') == null){
    	this.set('roles', new Array());
    }
    if(this.get('scopes') == null){
    	this.set('scopes', new Array());
    }
  },
	defaults:{
		label: null,
		eventName: null,
		symbol: null,
		type: null,
		roles: null,
		scopes: null
	},
  idAttribute: 'eventName'
});