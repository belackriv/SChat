'use strict';

import _ from 'underscore';
import Marionette from 'marionette';
import channelInfoTemplate from './channelInfo.hbs!';
import ChannelModesView from './channelModes';
import ModeCollection from 'lib/models/modeCollection';
import ChannelBansView from './channelBans';
import BanMaskCollection from 'lib/models/banMaskCollection';

import Radio from 'backbone.radio';

export default Marionette.LayoutView.extend({
	template: channelInfoTemplate,
	regions:{
		banList: '.schat-channel-ban-list',
		modeList: '.schat-channel-mode-list',
	},
	onBeforeShow(){
		this.showChildView('modeList', new ChannelModesView({
			collection: this.model.get('modes')
		}));
		this.showChildView('banList', new ChannelBansView({
			collection: this.model.get('bans')
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
		var changedModes = [];
		this.$el.find('.schat-channel-mode-checkbox').each((idx, checkbox)=>{
			this.model.get('modes').each((channelMode)=>{
				if(	channelMode.get('flag') === checkbox.name){
					var isChanged = false;
					if(channelMode.get('isSet') !== checkbox.checked){
						channelMode.set('isSet', checkbox.checked, {silent: true} );
						isChanged = true;
					}
					if(channelMode.get('paramName')){
						var paramValue = this.$el.find('input[name="'+channelMode.get('paramName')+'"]').val().trim();
						paramValue = paramValue==''?null:paramValue;
						if(channelMode.get('param') !== paramValue){
							if(channelMode.get('isSet')){
								if(paramValue){
									channelMode.set('param', paramValue, {silent: true});
									isChanged = true;	
								}
							}else{
								channelMode.set('param', null );
								isChanged = true;
							}
						}
					}
					if(isChanged){
						changedModes.push(channelMode.clone());
					}
				}
			});
		});
		var topic = (this.ui.topicInput.val().trim()=='')?null:this.ui.topicInput.val().trim();
		Radio.channel('dialog').trigger('submit', {
			topic: topic,
			modes: changedModes
		});
		Radio.channel('dialog').trigger('close');
		if(changedModes.length > 0){
			this.model.trigger('change:modes');
		}
	},
	_cancelForm(){
		Radio.channel('dialog').trigger('close');
	}
});