'use strict';

import Marionette from 'marionette';
import channelKeyTemplate from './channelKey.hbs!';
import Radio from 'backbone.radio';

export default Marionette.ItemView.extend({
	template: channelKeyTemplate,
	ui:{
		'form':'form',
		'keyInput': 'input[name=key]',
		'cancelButton': 'button[name=cancel]'
	},
	events:{
		'submit @ui.form': '_submitForm',
		'click @ui.cancelButton': '_cancelForm'
	},
	onModalShown(){
		this.ui.keyInput.focus();
	},
	_submitForm(event){
		event.preventDefault();
		Radio.channel('dialog').trigger('submit', { key: this.ui.keyInput.val() });
		Radio.channel('dialog').trigger('close');
	},
	_cancelForm(){
		Radio.channel('dialog').trigger('close');
	}
});