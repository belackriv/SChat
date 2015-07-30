'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	defaults:{
		name: null,
		topic: null,
    active: null,
    stale: null,
    alerted: false,
    userCount: 0
	},
  idAttribute: 'name'
});