'use strict';

import Backbone from 'backbone';
import ModeModel from './modeModel';

export default Backbone.Collection.extend({
	model: ModeModel
});