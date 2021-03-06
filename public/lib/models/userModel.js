'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
  initialize(){
    if(this.get('roles') == null){
      this.set('roles', new Array());
    }
  },
  defaults:{
    raw: null,
    name: null,
    nick: null,
    roleSymbol: null,
    roleName: null,
    roles: null,
    host: null,
    isAway: false
  },
  idAttribute: 'nick',
  parse(messageModel){
    if(typeof this.get('raw') === 'string'){
      var userStr = this.get('raw');
      var hasRole = false;
      if(userStr.indexOf('@') == 0){
        this.promote('o');
        hasRole = true;
      }else if(userStr.indexOf('+') == 0){
        this.promote('v');
        hasRole = true;
      }
      if(hasRole){
        userStr = userStr.slice(1);
      }
      this.set('nick', userStr.replace(/(\r\n|\n|\r)/gm, '') );
    }
    if(messageModel){
      switch(messageModel.get('command')){
        case 'JOIN':
          this.set('nick', messageModel.get('nick'));
          this.set('name', messageModel.get('parsedMessage').parsed.user.replace(/(\r\n|\n|\r)/gm, ''));
          this.set('host', messageModel.get('parsedMessage').parsed.host.replace(/(\r\n|\n|\r)/gm, ''));
          break;
        case 'RPL_WHOISUSER':
          this.set('nick', messageModel.get('parsedMessage').params[1].replace(/(\r\n|\n|\r)/gm, ''));
          this.set('name', messageModel.get('parsedMessage').params[2].replace(/(\r\n|\n|\r)/gm, ''));
          this.set('host', messageModel.get('parsedMessage').params[3].replace(/(\r\n|\n|\r)/gm, ''));
      }
    }
  },
  parseMode(mode){
    if(mode.get('flag') == 'a'){
      this.set('isAway', mode.get('isSet'));
    }else{
      var methodName = 'demote';
      if(mode.get('isSet')){
        methodName = 'promote';
      }
      this[methodName](mode.get('flag'));
    }
  },
  promote(role){
    this.addRole(role);
    switch(role){
      case 'o':
        this.set({
          roleSymbol: '@',
          roleName: 'op'
        });
        break;
      case 'v':
        if(!this.hasRole('o')){
          this.set({
            roleSymbol: '+',
            roleName: 'voice'
          });
        }
        break;
    }
  },
  demote(role){
    this.removeRole(role);
    switch(role){
      case 'o':
        if(this.hasRole('v')){
          this.set({
            roleSymbol: '+',
            roleName: 'voice'
          });
        }else{
          this.set({
            roleSymbol: null,
            roleName: null
          });
        }
        break;
      case 'v':
        if(this.hasRole('o')){
          this.set({
            roleSymbol: '@',
            roleName: 'op'
          });
        }else{
          this.set({
            roleSymbol: null,
            roleName: null
          });
        }
        break;
    }
  },
  hasRole(role){
    return (this.get('roles').indexOf(role) >= 0);
  },
  addRole(role){
    var roles = this.get('roles');
    var roleIndex = roles.indexOf(role);
    if(roleIndex == -1){
      roles.push(role);
    }
    this.set('roles', roles);
  },
  removeRole(role){
    var roles = this.get('roles');
    var roleIndex = roles.indexOf(role);
    if(roleIndex >= 0){
      roles.splice(roleIndex,1);
    }
    this.set('roles', roles);
  }
});