'use strict';

var AWS = require('aws-sdk'),
q = require ('q'),
request = require('request'),
kfapikey = require('./config/kfapikey.json'),
promise = require('promise');

function getSources(){ //obtains all data sources from the Klipfolio API
  var deferred = q.defer();
  var url = "https://app.klipfolio.com/api/1/datasources?limit=100";
  var headers =
  {
    'kf-api-key'   : kfapikey.kfapikey //fetches your token from ./config
  };
  request.get(url, {headers: headers}, function (error, response, body) {
    var array = JSON.parse(body);
    var parsed = array.data
    deferred.resolve(parsed);
  });
  return deferred.promise;
}

module.exports.run = function () {
  getSources().then(function(parsed){
    var length = parsed.datasources.length;
    console.log("Total data sources: "+length);
    var dataSourceList = [];
    var a = 0;
    for(var a=0; a<length; a++){
      if(parsed.datasources[a].description=="Adobe Analytics"){ //only pushes data sources with "Adobe Analytics" to the array/queue.
        dataSourceList.push(parsed.datasources[a].id)
      }
    }
    console.log("We currently have "+dataSourceList.length+" Adobe Analytics data sources. Performing API push.");
    var incrementer = 0;
    var resultsArray = [];
    var b = -1
    var myInterval = setInterval(function() {
      incrementer++
      b++
      if(incrementer == dataSourceList.length){
        clearInterval(myInterval)
        console.log("Finished!")
      }
      var url = "https://app.klipfolio.com/api/1.0/datasource-instances/"+dataSourceList[b]+"/@/refresh";
      var headers =
      {
        'kf-api-key'   : kfapikey.kfapikey
      };
      request.post(url, {headers: headers}, function (error, response, body) {
        var array = JSON.parse(body);
        console.log(b+ " - "+dataSourceList[b]+": "+array.meta.status);
        //error handles disabled connections.
        if(array.meta.status == 403){ //403 error handler. If The data source is unavailable, it will attempt to re-enable the data source.
          console.log("Data Source disabled. Re-enabling datasource.");
          var enabler = "https://app.klipfolio.com/api/1.0/datasources/"+dataSourceList[b]+"/@/enable";
          request.post(enabler, {headers: headers}, function (error, response, body) {
            var array = JSON.parse(body);
            console.log(b+ " - "+dataSourceList[b]+": "+body);
            b--
          });
          //
        }
      });
    },1100); //throttling at 1.1 seconds. Please change this to refect your usage. 
  });
}
