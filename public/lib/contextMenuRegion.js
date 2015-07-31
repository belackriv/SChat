'use strict';

import Marionette from 'marionette';

export default Marionette.Region.extend({
	onShow(view, region, options){
		region.open(view);
		region.$el.position({
			at: "bottom right",
			of: options.event,
			collision: "fit"
		});
		this.clickOffHandler = this.clickOff.bind(this, view, event);
		$('body').on('click contextmenu', this.clickOffHandler);
	},
	clickOff(view, event){
		/*
		if(event.target != view.el && view.$el.has(event.target).length == 0){
				region.close(view);
			}
			if(event.type == 'contextmenu'){
				if(event.target == view.el || view.$el.has(event.target).length){
					event.preventDefault();
					event.stopPropagation();
				}
			}*/
			this.close(view);
	},
	open(view){
		if(view){
			view.$el.css('display','block');
		}else if(this.currentView){
			this.currentView.$el.css('display','block');
		}
	},
	close(view){
		$('body').off('click contextmenu', this.clickOffHandler);
		if(view){
			view.$el.css('display','none');
		}else if(this.currentView){
			this.currentView.$el.css('display','none');
		}
	}
});
