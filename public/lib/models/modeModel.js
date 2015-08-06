'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import modesDefine from './modesDefine';

var ModeModel =  Backbone.Model.extend({
  initialize(){
    if(this.get('roles') == null){
      this.set('roles', new Array());
    }
    if(this.get('scopes') == null){
      this.set('scopes', new Array());
    }
  },
  defaults:{
    label: null,
    eventName: null,
    flag: null,
    isSet: false,
    type: null,
    roles: null,
    scopes: null,
    param: null
  },
  idAttribute: 'eventName'
});

ModeModel.parseModes = function(message){
  var modes = [];
  var rawModes = [];
  var messageParamIndex = 1;
  if(message.command != 'MODE'){
    messageParamIndex = 2;
  }
  var modesStr = message.params[messageParamIndex].replace(/(\r\n|\n|\r)/gm, '');
  var currentMod = '';
  for(let modeChar of modesStr){
    if(modeChar == '+' || modeChar == '-' ){
      currentMod = modeChar;
    }else{
      rawModes.push(currentMod+modeChar);
    }
  }
  var paramIndex = messageParamIndex + 1;
  for(let rawMode of rawModes){
    var mode = {
      flag: rawMode[1],
      isSet: false
    };
    if(rawMode[0] == '+'){
      mode.isSet = true;
    }
    var definedMode = _.findWhere(modesDefine,mode);
    if(typeof definedMode === 'undefined'){
      definedMode = _.findWhere(modesDefine,{flag: mode.flag}); 
    }
    if(typeof definedMode === 'undefined'){
      throw 'MODE '+mode.flag+' not found!';
    }
    var modeModel = new ModeModel(definedMode);
    modeModel.set('isSet', mode.isSet);
    switch(mode.flag){
      case 'o':
      case 'v':
      case 'k':
      case 'l':
      case 'b':
      case 'e':
      case 'I':
        if(modeModel.get('isSet')){
          modeModel.set('param', message.params[paramIndex].replace(/(\r\n|\n|\r)/gm, ''));
          paramIndex++;
        }
        break;
      default:
        break;
    }
    modes.push(modeModel);
  }

  return modes;
};

export default ModeModel;