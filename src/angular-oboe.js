'use strict';
angular.module('ngOboe', []).service('Oboe', [
    'OboeStream',
    function (OboeStream) {
        // the passed parameters object need to have a Url and a pattern.
        // all parameters consumed by the oboe module can be consumed
        // the url needs to return a json stream. see the oboe documentation
        // the pattern contains a path which selects json objects from the stream
        return function (params) {
            return OboeStream.search(params);
        };
    }
]).factory('OboeStream', [
    '$q',
    function ($q) {
        return {
            search: function (params) {
                var defer = $q.defer();

                // call the oboe function to start the stream
                oboe(params).start(function () {
                	// do something?
                }).node(params.pattern || '.', function (node) {

                	//update the caller
                    defer.notify(node);

                    // free up memory
                    return oboe.drop;
                }).done(function (result) {

                    // when the stream is done, pass this data along
                    defer.resolve(result);
                });

                return defer.promise;
            }
        };
    }
]);