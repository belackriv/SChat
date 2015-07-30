'use strict';

import Marionette from 'marionette';
import appLayoutTpl from './app_layout.hbs!';
import Radio from 'backbone.radio';

export default Marionette.LayoutView.extend({
	initialize(){
		Radio.channel('dialog').on('open',this._openDialog.bind(this));
		Radio.channel('dialog').on('close',this._closeDialog.bind(this));
	},
  template: appLayoutTpl,
  el: "body",
  ui:{
  	'dialog': '#dialog'
  },
  regions: {
    navbar: "nav",
    header: "header",
    main: "#main-section",
    footer: 'footer',
    dialogContent: '#dialog-content'
  },
  onRender(){
  	this.ui.dialog.modal({show:false});
  },
  _openDialog(view){
  	this.ui.dialog.one('shown.bs.modal', ()=>{
  		this.showChildView('dialogContent', view);	
  	});
  	this.ui.dialog.modal('show');
  },
	_closeDialog(){
		this.ui.dialog.modal('hide');
		this.getRegion('dialogContent').reset();
	}
});


    
