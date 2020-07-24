'use strict';
/* api/router/index.js */

/*
  Bootstrap routes on main express app.
*/
let bootstrap = (app) => {
  app.use('/', require('./home'));
  app.use('/client', require('./client'));
  app.use('/admin', require('./admin'));
};

module.exports = {
  bootstrap: bootstrap
};

