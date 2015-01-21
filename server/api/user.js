/* lib/api.js */
/* global require */

'use strict';

var koast = require('koast');
var koastRouter = koast.koastRouter;
var connection = koast.db.getConnectionNow();
var mapper = koast.mongoMapper.makeMapper(connection);
var providerAccounts = connection.model('userProviderAccounts');
var oauth = require('../../node_modules/koast/lib/authentication/oauth.js');

var defaults = {
  authorization: function (req, res) {
    return true;
  }
};

mapper.options.useEnvelope = false;

var routes = [{
  method: 'get',
  route: 'me',
  handler: function(req, res) {
    oauth.getUserFromProfile(providerAccounts, req.user.data)
      .then(function(user) {

        res.status(200).send(user);
      });
  }
}];

module.exports = exports = {
  koastModule: {
    defaults: defaults,
    router: koastRouter(routes, defaults)
  }
};