'use strict';
import _ from 'underscore';
import Marionette from 'marionette';
import tabsTemplate from './tabs.hbs!';
import tabTemplate from './tab.hbs!';
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
    'change:active': '_checkStatus',
    'change:stale': '_checkStatus',
    'change:alerted': '_checkStatus'
  },
  attributes: {role:'presentation'},
  onRender(){
    this._checkStatus();
  },
  _checkStatus(){
    _.each(this._statusClasses,(statusClass)=>{
      if(this.model.get(statusClass.status)){
        this.$el.removeClass(_.pluck(this._statusClasses, 'class').join(' '));
        this.$el.addClass(statusClass.class);
      }else{
        this.$el.removeClass(statusClass.class);
      }
    });
  },
  _statusClasses: [
    {status: 'active', class: 'active'},
    {status: 'stale', class: 'bg-warning'},
    {status: 'alerted', class: 'bg-danger'}
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
  childViewContainer: 'ul',
  onRender(){
    this.$el.find('ul').sortable({
      axis: 'x'
    });
  },
  onAddChild(){
    this._refreshSortable();
  },
  onRemoveChild(){
    this._refreshSortable();
  },
  _refreshSortable(){
     this.$el.find('ul').sortable('refresh');
  }
});
