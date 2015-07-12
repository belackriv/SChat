'use strict';
import _ from 'underscore';
import Marionette from 'marionette';
import usersTemplate from './users.hbs!';
import userTemplate from './user.hbs!';
import Radio from 'backbone.radio';


var TabChildView = Marionette.ItemView.extend({
  template: tabTemplate,
  tagName: 'li',
  ui: {
    'part': 'button[name=part]'
  },
  events:  {
    'click' : '_handleClick'
  },
  modelEvents: {
    'change': 'render'
  },
  attributes: {role:'presentation'},
  onRender(){
    var view = this;
    _.each(view._statusClasses,(statusClass)=>{
      if(view.model.get(statusClass.status)){
        view.$el.removeClass(_.pluck(view._statusClasses, 'class').join(' '));
        view.$el.addClass(statusClass.class);
      }else{
        view.$el.removeClass(statusClass.class);
      }
    });
  },
  _statusClasses: [
    {status: 'active', class: 'active'},
    {status: 'stale', class: '"bg-warning'},
    {status: 'alerted', class: '"bg-danger'}
  ],
  _handleClick(event){
    if(event.target == this.ui.part.get(0) || this.ui.part.has(event.target).length){
      Radio.channel('channels').trigger('part', this.model);
    }else{
      Radio.channel('channels').trigger('activate', this.model);
    }
  }
});



export default Marionette.CompositeView.extend({
  childView: TabChildView,
  template: tabsTemplate,
  childViewContainer: 'ul'
});
