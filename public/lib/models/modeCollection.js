'use strict';

import Backbone from 'backbone';
import ModeModel from './modeModel.js';

export default Backbone.Collection.extend({
	model: ModeModel
});