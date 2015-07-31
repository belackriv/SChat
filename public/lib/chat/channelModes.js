'use strict';


import Marionette from 'marionette';
import channelModesTemplate from './channelModes.hbs!';
import Radio from 'backbone.radio';


export default Marionette.LayoutView.extend({
	template: channelModesTemplate,
});