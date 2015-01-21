/* lib/api.js */
/* global require */

'use strict';

var R = require('ramda');
var moment = require('moment');
var koast = require('koast');
var koastRouter = koast.koastRouter;
var connection = koast.db.getConnectionNow();
var mapper = koast.mongoMapper.makeMapper(connection);
var providerAccounts = connection.model('userProviderAccounts');
var request = require('superagent');

var defaults = {
  authorization: function (req, res) {
    return true;
  }
};

var unFinished = function(game) {
  return !game.status;
};

mapper.options.useEnvelope = false;

var routes = [{
  method: 'get',
  route: 'nextgame/:_teamId',
  handler: function(req, res) {

    var monthIdx = (moment().month() + 1);
    var month = (monthIdx < 10) ?
      '0' + monthIdx :
      monthIdx;
    var year = moment().format('YYYY');
    var team = req.params._teamId;

    /**
     * Filters the next game using the provided response
     *
     * @param {object} response API response
     * @returns {object}
     */
    function respondWithNextGame(response) {
      if (response.error) {
        return res.status(404).json({error: 'Invalid request.'})
      }

      var games = response.body.games;
      var gamesUnfinished = R.filter(unFinished, games);
      var firstUnfinishedGame = gamesUnfinished[0];

      return res.status(200).json(firstUnfinishedGame);
    }

    request
      .get('http://nhlwc.cdnak.neulion.com/fs1/nhl/league/clubschedule/' + team
        + '/' + year + '/' + month + '/iphone/clubschedule.json',
        respondWithNextGame);
  }
}];

module.exports = exports = {
  koastModule: {
    defaults: defaults,
    router: koastRouter(routes, defaults)
  }
};
