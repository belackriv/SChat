'use strict';

import Marionette from 'marionette';
import awayMessageTemplate from './awayMessage.hbs!';
import Radio from 'backbone.radio';

export default Marionette.ItemView.extend({
	template: awayMessageTemplate,
	ui:{
		'form':'form',
		'messageInput': 'input[name=message]',
		'cancelButton': 'button[name=cancel]'
	},
	events:{
		'submit @ui.form': '_submitForm',
		'click @ui.cancelButton': '_cancelForm'
	},
	onModalShown(){
		this.ui.messageInput.focus();
	},
	_submitForm(event){
		event.preventDefault();
		Radio.channel('dialog').trigger('submit', { message: this.ui.messageInput.val() });
		Radio.channel('dialog').trigger('close');
	},
	_cancelForm(){
		Radio.channel('dialog').trigger('close');
	}
});