'use strict';
angular.module('ngOboe', []).service('Oboe', [
  'OboeStream',
  function (OboeStream) {
    // the passed parameters object need to have a Url and a pattern.
    // all parameters consumed by the oboe module can be consumed
    // the url needs to return a json stream. see the oboe documentation
    // the pattern contains a path which selects json objects from the stream
    // the pagesize parameter determines how many JSON objects need to be received before the controller gets updated. Defaults to 100.
    return function (params) {
      return OboeStream.search(params);
    };
  }
]).factory('OboeStream', [
  '$q',
  function ($q) {
    return {
      search: function (params, callback) {
        // the defer will be resolved immediately
        var defer = $q.defer();
        // counter for the received records
        var counter = 0;
        // I use an arbitrary page size.
        var pagesize = params.pagesize || 100;
        // initialize the page of records
        var page = [];
        // call the oboe function to start the stream
        oboe(params).start(function () {
        }).node(params.pattern || '.', function (node) {
          defer.notify(node);
          // freeup memory
          return oboe.drop;
        }).done(function (result) {
          // when the stream is done make sure the last page of nodes is returned
          defer.notify(result);
          defer.resolve();
        });
        return defer.promise;
      }
    };
  }
]);