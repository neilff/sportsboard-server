/* lib/api.js */
/* global require */

'use strict';

var koast = require('koast');
var koastRouter = koast.koastRouter;
var connection = koast.db.getConnectionNow();
var mapper = koast.mongoMapper.makeMapper(connection);
var availableWidgets = require('./json/available-widgets');

/**
 * Default Authorization
 *
 * @type {Object}
 */
var defaults = {
  authorization: function (req, res) {

    return (req.user && req.user.isAuthenticated) ?
      true :
      false;
  }
};

mapper.options.useEnvelope = true;

/**
 * Use this only in development
 *
 * @type {Object}
 */
var disableAuth = {
  authorization: function(req, res) {
    return true;
  }
};

/**
 * Returns a list of widgets available
 *
 * @param {object} req Request
 * @param {object} res Response
 * @returns {array}
 */
function getAllWidgets(req, res) {

  res.status(200).send(availableWidgets);
}

var routes = [{
  method: 'get',
  route: '/',
  handler: getAllWidgets
}];

module.exports = exports = {
  koastModule: {
    defaults: disableAuth,
    router: koastRouter(routes, disableAuth)
  }
};