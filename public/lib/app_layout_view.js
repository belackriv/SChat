'use strict';

import Marionette from 'marionette';
import appLayoutTpl from './app_layout.hbs!';
import ContextMenuRegion from './contextMenuRegion.js';
import Radio from 'backbone.radio';

export default Marionette.LayoutView.extend({
	initialize(){
		Radio.channel('dialog').on('open',this._openDialog.bind(this));
		Radio.channel('dialog').on('close',this._closeDialog.bind(this));
    Radio.channel('contextMenu').on('open',this._openContextMenu.bind(this));
    Radio.channel('contextMenu').on('close',this._closeContextMenu.bind(this));
	},
  template: appLayoutTpl,
  el: 'body',
  ui:{
  	'dialog': '#dialog'
  },
  regions: {
    navbar: 'nav',
    header: 'header',
    main: '#main-section',
    footer: 'footer',
    dialogContent: '#dialog-content',
    contextMenu: {
      selector: '#context_menu',
      regionClass: ContextMenuRegion
    }
  },
  onRender(){
  	this.ui.dialog.modal({show:false});
  },
  _dialogShown: false,
  _openDialog(view){
    var showDialog = ()=>{
      this.showChildView('dialogContent', view);
      this.ui.dialog.one('shown.bs.modal', ()=>{
        view.triggerMethod('modal:shown');
        this._dialogShown = true;
      });
      this.ui.dialog.modal('show');
    };
    if(this._dialogShown){
      this.ui.dialog.one('hidden.bs.modal', ()=>{
        showDialog();
      });
    }else{
      showDialog();
    }
  },
	_closeDialog(){
    this.ui.dialog.one('hidden.bs.modal', ()=>{
      this.getRegion('dialogContent').currentView.triggerMethod('modal:hidden');
      this.getRegion('dialogContent').reset();
      this._dialogShown = false;
    });
		this.ui.dialog.modal('hide');
	},
  _openContextMenu(event, view){
    this.getRegion('contextMenu').show(view,{event: event});
  },
  _closeContextMenu(){
    this.getRegion('contextMenu').close();
  }
});
