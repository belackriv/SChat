'use strict';

import Backbone from 'backbone';
import BanMaskModel from './banMaskModel';

export default Backbone.Collection.extend({
	model: BanMaskModel
});