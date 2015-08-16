'use strict';

import Radio from 'backbone.radio';
import Marionette from 'marionette';
import template from './template.hbs!';
import MessageModel from 'lib/models/messageModel';
import AwayMessageView from './awayMessage';

export default Marionette.ItemView.extend({
  initialize(){
    Radio.channel('socket').on('connected',this._connected.bind(this));
    Radio.channel('socket').on('disconnected',this._disconnected.bind(this));
    Radio.channel('users').on('changeMyNick',this._modelChange.bind(this,'nick'));
    Radio.channel('navbar').on('setIsAway', this._setIsAway.bind(this));
    Radio.channel('navbar').on('connect', this._connectionHandler.bind(this));
    Radio.channel('navbar').on('join', this._joinHandler.bind(this));
    Radio.channel('navbar').on('valid',this._setFormGroupValidity.bind(this, true));
    Radio.channel('navbar').on('invalid',this._setFormGroupValidity.bind(this, false));
    this.model.set('nick',Radio.channel('users').request('getMyNick'));
    this.model.set('server',Radio.channel('channels').request('getServerName'));
    this.model.set('connected',Radio.channel('channels').request('isConnected'));
  },
  template: template,
  className: 'container-fluid',
  ui: {
    'nickInput': 'input[name=nick]',
    'nickButton': 'button.schat-navbar-nick-button',
    'connectButton': 'button[name=connect]',
    'channelNameInput': 'input[name=channel]',
    'joinButton': 'button.schat-navbar-join-button',
    'awayButton': 'button.schat-navbar-away-button',
    'volumeToggleButton': 'button[name=volume_toggle]',
    'nickForm': 'form.schat-navbar-nick-form',
    'channelForm': 'form.schat-navbar-channel-form',
  },
  events: {
    'change @ui.nickInput': '_nickHandler',
    'click @ui.nickButton': '_nickHandler',
    'click @ui.connectButton': '_connectionHandler',
    'click @ui.joinButton': '_joinHandler',
    'click @ui.awayButton': '_awayHandler',
    'submit @ui.nickForm': '_submitNickHandler',
    'submit @ui.channelForm': '_submitJoinHandler',
  },
  modelEvents:{
    'change': 'render'
  },
  onRender(){
    if(this.model.get('connected')){
      this.ui.joinButton.removeClass('disabled');
      this.ui.awayButton.removeClass('disabled');
    }
  },
  _modelChange(prop, value){
    this.model.set(prop, value);
  },
  _connected(){
    this._modelChange('connected', true);
  },
  _disconnected(){
    this._modelChange('connected', false);
  },
  _connectionHandler(){
    if(Radio.channel('channels').request('isConnected')){
      Radio.channel('socket').trigger('disconnect');
    }else{
      Radio.channel('socket').trigger('connect', {
        server: Radio.channel('channels').request('getServerName'),
        nick: Radio.channel('users').request('getMyNick')
      });
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
    if(this.model.get('connected')){
      var name = null;
      if(typeof event === 'string'){
        name = event;
      }else{
        event.preventDefault();
        name = this.ui.channelNameInput.val().toLowerCase();
      }
      if(name){
        name = (name.indexOf('#') == 0)?name:'#'+name;
        Radio.channel('channels').trigger('join', name);
        this.ui.channelNameInput.val('');
      }
    }else{
      this._setFormGroupValidity(false, 'channelNameInput', 'Not Connected To Server');
    }
  },
  _awayHandler(event){
    if(this.model.get('connected')){
      var messageModel = new MessageModel({command: 'AWAY'});
      if(this.model.get('isAway')){
        messageModel.set('message', false);
        Radio.channel('messages').trigger('send', messageModel);
      }else{
        var setAway = (data)=>{
          if(data.message.trim()){
            messageModel.set('message', data.message.trim());
            Radio.channel('messages').trigger('send', messageModel);
          }else{
            this._setFormGroupValidity(false, 'channelNameInput', 'Must Set Message');
          }
        };
        Radio.channel('dialog').on('submit', setAway);
        Radio.channel('dialog').once('close', ()=>{
          Radio.channel('dialog').off('submit', setAway);  
        });
        Radio.channel('dialog').trigger('open', new AwayMessageView() );
      }
    }else{
      this._setFormGroupValidity(false, 'channelNameInput', 'Not Connected To Server');
    }
  },
  _setIsAway(value){
    this.model.set('isAway', value);
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