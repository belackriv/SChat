'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	defaults:{
		command: null,
	},
  idAttribute: 'command'
});