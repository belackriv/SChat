'use strict';
import _ from 'underscore';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import Radio from 'backbone.radio';


var UserChildView = Marionette.ItemView.extend({
  template: userTemplate,
  tagName: 'li',
  events:  {
    'click' : '_handleClick'
  },
  modelEvents: {
    'change': 'render'
  },
  onRender(){

  },
  _handleClick(event){

  }
});



export default Marionette.CompositeView.extend({
  childView: UserChildView,
  template: usersTemplate,
  childViewContainer: 'ul'
});
