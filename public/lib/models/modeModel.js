'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	defaults:{
		label: null,
		eventName: null,
		roles: []
	},
  idAttribute: 'eventName'
});