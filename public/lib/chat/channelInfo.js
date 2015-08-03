'use strict';

import Marionette from 'marionette';
import channelInfoTemplate from './channelInfo.hbs!';
import ChannelModesView from './channelModes';
import ModeCollection from 'lib/models/modeCollection';
import modes from 'lib/models/modes';
import Radio from 'backbone.radio';

export default Marionette.LayoutView.extend({
	template: channelInfoTemplate,
	regions:{
		banList: '.schat-channel-ban-list',
		modeList: '.schat-channel-mode-list',
	},
	onBeforeShow(){


		var channelModes = modes.filter((mode)=>{
			return mode.get('scopes').indexOf('channelFlag') > -1;
		});
		this.showChildView('modeList', new ChannelModesView({
			collection: new ModeCollection(channelModes),
		}));
	},
	ui:{
		'form':'form',
		'cancelButton': 'button[name=cancel]',
		'topicInput': '#topic-input'
	},
	events:{
		'submit @ui.form': '_submitForm',
		'click @ui.cancelButton': '_cancelForm'
	},
	_submitForm(event){
		event.preventDefault();
		Radio.channel('dialog').trigger('submit', {
			topic: this.ui.topicInput.val()
		});
		Radio.channel('dialog').trigger('close');
	},
	_cancelForm(){
		Radio.channel('dialog').trigger('close');
	}
});