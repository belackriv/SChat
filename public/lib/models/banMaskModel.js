'use strict';

import Backbone from 'backbone';


export default Backbone.Model.extend({
  defaults:{
    mask: null    
  },
  idAttribute: 'mask',
});