'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	defaults:{
    raw: null,
		name: null,
		nick: null,
    role: null,
    whois: null
	},
  idAttribute: 'nick',
  parse(){
    if(typeof this.get('raw') === 'string'){
      var userStr = this.get('raw');
      var role = '';
      if(userStr.indexOf('@')== 0 || userStr.indexOf('+')== 0){
        role = userStr.CharAt(0);
      }
      if(role){
        userStr = userStr.slice(1);
      }
      this.set('nick', userStr);
      this.set('role', role);
    }
  },
  
});