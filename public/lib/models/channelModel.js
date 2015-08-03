'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	initialize(){
		if(this.get('topicHistory') === null){
			//this will be newest first at [0]
			//so use splice(0,0,elem) instead of push
			this.set('topicHistory', new Array());
		}
		if(this.get('modes') == null){
			this.set('modes', new Array());
		}
	},
	defaults:{
		name: null,
		topic: null,
		topicHistory: null,
		active: null,
		stale: null,
		alerted: false,
		modes: null,
		userCount: 0
	},
  idAttribute: 'name'
});