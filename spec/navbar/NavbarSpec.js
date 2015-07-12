
import Backbone from 'backbone';
import $ from 'jquery';

import App from 'public/lib/app';
import navbarService from 'public/lib/navbar/service';

var app;

describe('Navbar', function() {
  beforeEach(function() {
    app = new App();
    navbarService.setup({
      container: app.layout.navbar
    });
    app.start();
    navbarService.start();
  });

  it('should connect when "connectButton" clicked', function() {
    spyOn(app.layout, 'onChildviewConnect');
    navbarService.container.currentView.ui.connectButton.click();
    expect(app.layout.onChildviewConnect).toHaveBeenCalled();
  });
});