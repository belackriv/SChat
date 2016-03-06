'use strict';

import Backbone from 'backbone';
import ModeCollection from './modeCollection.js';
import BanMaskCollection from './banMaskCollection.js';
import modes from './modes.js';

export default Backbone.Model.extend({
  initialize(){
    if(this.get('topicHistory') === null){
      //this will be newest first at [0]
      //so use splice(0,0,elem) instead of push
      this.set('topicHistory', new Array());
    }
    if(this.get('modes') == null){
      var modesCollection = new ModeCollection();
      var channelModes = modes.filter((mode)=>{
        return mode.get('scopes').indexOf('channelModeContext') > -1;
      });
      for(let mode of channelModes){
        modesCollection.add(mode.clone());
      }
      this.set('modes', modesCollection);
      modesCollection.on('change', ()=>{
        this.trigger('change:modes');
      });
    }
    if(this.get('bans') === null){
      var bansCollection = new BanMaskCollection();
      this.set('bans', bansCollection);
      bansCollection.on('change', ()=>{
        this.trigger('change:bans');
      });
    }
  },
  defaults:{
    name: null,
    topic: null,
    topicHistory: null,
    active: null,
    stale: null,
    alerted: false,
    modes: null,
    userCount: 0,
    bans: null
  },
  idAttribute: 'name',
  parseMode(mode){
    if(mode.get('flag') == 'b'){
      var bans = this.get('bans');
      if(mode.get('isSet')){
        if(!bans.get(mode.get('param'))){
           bans.add({mask: mode.get('param')});
        }
      }else{
        bans.remove(mode.get('param'));
      }
    }else{
      var modeModel = this.get('modes').findWhere({flag: mode.get('flag')});
      if(modeModel){
        modeModel.set({
          isSet:  mode.get('isSet'),
          param:  mode.get('param')
        });
      }
    }
  }
});