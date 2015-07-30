'use strict';

import Marionette from 'marionette';
import kickTemplate from './kick.hbs!';
import Radio from 'backbone.radio';

export default Marionette.ItemView.extend({
	template: kickTemplate,
	ui:{
		'form':'form',
		'reasonInput': 'input[name=reason]',
		'cancelButton': 'button[name=cancel]'
	},
	events:{
		'submit @ui.form': '_submitForm',
		'click @ui.cancelButton': '_cancelForm'
	},
	onAttach(){
		this.ui.reasonInput.focus();
	},
	_submitForm(event){
		event.preventDefault();
		Radio.channel('dialog').trigger('submit', { reason: this.ui.reasonInput.val() });
		Radio.channel('dialog').trigger('close');
	},
	_cancelForm(){
		Radio.channel('dialog').trigger('close');
	}
});