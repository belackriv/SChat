'use strict';

import Backbone from 'backbone';
import BanMaskModel from './banMaskModel.js';

export default Backbone.Collection.extend({
	model: BanMaskModel
});