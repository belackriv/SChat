'use strict';

import Backbone from 'backbone';
import modes from 'lib/models/modes';


export default Backbone.Model.extend({
  initialize(){
    if(this.get('topicHistory') === null){
      //this will be newest first at [0]
      //so use splice(0,0,elem) instead of push
      this.set('topicHistory', new Array());
    }
    if(this.get('modes') == null){
      var channelModes = modes.filter((mode)=>{
        return mode.get('scopes').indexOf('channelModeContext') > -1;
      });
      var clonedModes = [];
      for(let mode of channelModes){
        clonedModes.push(mode.clone());
      }
      this.set('modes', clonedModes);
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
    userCount: 0
  },
  idAttribute: 'name',
  parseMode(mode){
    for(let modeModel of this.get('modes')){
      if(modeModel.get('flag') == mode.get('flag')){
        modeModel.once('change', ()=>{
          this.trigger('change:modes');
        });
        modeModel.set({
          isSet:  mode.get('isSet'),
          param:  mode.get('param')
        });
      }
    }
  }
});