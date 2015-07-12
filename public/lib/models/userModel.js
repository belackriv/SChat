'use strict';

import Backbone from 'backbone';

export default Backbone.Model.extend({
	defaults:{
		name: null,
		nick: null,
    role: null
	}
  getRoleSymbol(){
    switch(this.get('role')){
      case '':
      default:
        return '';
    }
  }
});