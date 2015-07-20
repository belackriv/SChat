'use strict';
import _ from 'underscore';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import Radio from 'backbone.radio';


var UserChildView = Marionette.ItemView.extend({
  template: userTemplate,
  className: 'list-group-item schat-user-item',
  tagName: 'li',
  events:  {
    'click' : '_handleClick'
  },
  modelEvents: {
    'change': 'render'
  },
  onRender(){
    if(this.model.get('isActive')){
      this.$el.addClass('active');
    }else{
      this.$el.removeClass('active');
    }
  },
  _handleClick(event){
    this.model.set('isActive', true);
    this.triggerMethod('activate');
  }
});



export default Marionette.CompositeView.extend({
  childView: UserChildView,
  template: usersTemplate,
  childViewContainer: 'ul',
  onChildviewActivate(childView){
    this.collection.each((model)=>{
      if(model != childView.model){
        model.set('isActive', false);
      }
    });
  }
});
