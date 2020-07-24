'use strict';
/* api/router/index.js */

/*
  Bootstrap routes on main express app.
*/
let bootstrap = (app) => {
  app.use('/', require('./home'));
  app.use('/client', require('./client'));
};

module.exports = {
  bootstrap: bootstrap
};
