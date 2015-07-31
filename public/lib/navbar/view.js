'use strict';

import Radio from 'backbone.radio';
import Marionette from 'marionette';
import template from './template.hbs!';

export default Marionette.ItemView.extend({
  initialize(){
    Radio.channel('navbar').on('valid',this._setFormGroupValidity.bind(this, true));
    Radio.channel('navbar').on('invalid',this._setFormGroupValidity.bind(this, false));
    this.model.set('nick',Radio.channel('users').request('getMyNick'));
    this.model.set('server',Radio.channel('channels').request('getServerName'));
    this.model.set('connected',Radio.channel('channels').request('isConnected'));
    Radio.channel('channels').on('connect',this._modelChange.bind(this,'connected', true));
    Radio.channel('channels').on('disconnect',this._modelChange.bind(this,'connected', false));
    Radio.channel('users').on('changeMyNick',this._modelChange.bind(this,'nick'));
  },
  template: template,
  className: 'container-fluid',
  ui: {
    'nickInput': 'input[name=nick]',
    'nickButton': 'button.schat-navbar-nick-button',
    'connectButton': 'button[name=connect]',
    'channelNameInput': 'input[name=channel]',
    'joinButton': 'button.schat-navbar-join-button',
    'volumeToggleButton': 'button[name=volume_toggle]',
    'nickForm': 'form.schat-navbar-nick-form',
    'channelForm': 'form.schat-navbar-channel-form',
  },
  events: {
    'click @ui.nickButton': '_nickHandler',
    'click @ui.connectButton': '_connectionHandler',
    'click @ui.joinButton': '_joinHandler',
    'submit @ui.nickForm': '_submitNickHandler',
    'submit @ui.channelForm': '_submitJoinHandler',
  },
  modelEvents:{
    'change': 'render'
  },
  _modelChange(prop, value){
    this.model.set(prop, value);
  },
  _connectionHandler(){
    if(Radio.channel('channels').request('isConnected')){
      Radio.channel('channels').trigger('disconnect');
    }else{
      Radio.channel('channels').trigger('connect');
    }
  },
  _submitNickHandler(event){
    event.preventDefault();
    this._nickHandler();
  },
  _nickHandler(event){
    event.preventDefault();
    if(this.ui.nickInput.val()){
      Radio.channel('users').trigger('changeMyNick', this.ui.nickInput.val());
    }
  },
  _submitJoinHandler(event){
    event.preventDefault();
    this._joinHandler();
  },
  _joinHandler(event){
    event.preventDefault();
    if(this.ui.channelNameInput.val()){
      var name = this.ui.channelNameInput.val().toLowerCase();
      name = (name.indexOf('#') == 0)?name:'#'+name;
      Radio.channel('channels').trigger('join', name);
      this.ui.channelNameInput.val('');
    }
  },
  _setFormGroupValidity(state, uiName, message = ''){
    if(state){
      this.ui[uiName].parent().removeClass('has-error');
      this.ui[uiName].parent().siblings('span.error-mesg').removeClass('alert alert-danger').text('');
    }else{
      this.ui[uiName].parent().addClass('has-error');
      this.ui[uiName].parent().siblings('span.error-mesg').addClass('alert alert-danger').text(message);
      setTimeout(()=>{
        this.ui[uiName].parent().removeClass('has-error');
        this.ui[uiName].parent().siblings('span.error-mesg').removeClass('alert alert-danger').text('');
      }, 1000);
    }
  }
});