//scraper.js

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('sync-request');
var jsdom = require('jsdom');
var asyncreq = require('request')

var url = 'http://localhost/Assignment2/VincentLee/';

//console.log(process.argv[2]);   // command line arguments.  will use for URL

var h = new urlHelper(url);

listBuilder(url, h.getDomain());


//testRunner(url);

function urlHelper(url){

	var _url = url

	this.addSubfolder = function(subfolder){
		if ((_url.length - _url.lastIndexOf('/')) == 1){
			return (_url + subfolder);
		} else {
			return (_url + '/' + subfolder);
		}
	}

	this.getDomain = function(){
		return _url.split(this.getProtocol() + '://')[1]
	}

	this.getProtocol = function(){
		return _url.substring(0, _url.indexOf(':'))
	}

	this.getHost = function(){
 		var _host = _url.split(this.getProtocol() + '://')[1];
 		_host = _host.substring(0, _host.indexOf('/'));
 		return _host;
	}

}


function testRunner(url){
	jsdom.env(
	  url,
	  ["http://code.jquery.com/jquery.js"],
	  function (err, window) {

	    structureTests(window.$("head").length, "head", true);
	    structureTests(window.$("nav").length, "nav", true);
	    structureTests(window.$("article").length, "article", false);
	    structureTests(window.$("section").length, "section", false);
	    structureTests(window.$("footer").length, "footer", true);

	    insightTest(window.$('script').length, 'script');
	    insightTest(window.$('meta').length, 'meta');
	    insightTest(window.$('br').length, 'br');
	    insightTest(window.$('b').length, 'b');
	    insightTest(window.$('i').length, 'i');
	    insightTest(window.$('iframe').length, 'iframe');
	    insightTest(window.$('video').length, 'video');
	    insightTest(window.$('audio').length, 'audio');
	    insightTest(window.$('svg').length, 'svg');
	    insightTest(window.$('canvas').length, 'canvas');
	  }
	);
	fileSystemTest(url, 'images');
	fileSystemTest(url, 'js');
	fileSystemTest(url, 'style');
	fileSystemTest(url, 'audio');
	fileSystemTest(url, 'video');
	fileSystemTest(url, 'fonts');
}

function fileSystemTest(url, testDir){
	
	var testURL = h.addSubfolder(testDir);

	asyncreq(testURL, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(testURL, 'FOUND');
	  } else{
	  	console.log(testURL, response.statusCode);
	  }

	})
}


function insightTest(numTags, tag){
	console.log(numTags + ' ' + tag + ' tags found.');
}


function imageTests(page){
	// Image tests go here..
}

function structureTests(numTags, tag, unique){

	if (unique){
		if (numTags == 0){
			console.log('You should have one ' + tag + ' tag' )	
		} else if (numTags = 1 ){
			console.log( numTags + " " + tag + ' found: You should only have one: CORRECT');
		} else if (numTags >= 1 ){
			console.log( numTags + " " + tag + ' found: You should not have more than one')
		} else {
			console.log('fell out of loop');
		}

	} else {

		if (numTags == 0) { 
			console.log('You should have at least one ' + tag )
		} else if (numTags >=1 ){
			console.log( numTags + " " + tag + 's found: CORRECT')
		} else {
			console.log('fell out of loop');
		}

	}

}

function listBuilder(url, domain){
	
	var _domain = domain;

	jsdom.env(
	  url,
	  ["http://code.jquery.com/jquery.js"],
	  function (err, window, host) {


	    var links = (window.$("a"));

	    links = (listCleaner(links))

	    for (var i = 0; i< links.length; i++){
	    	console.log(links[i])
	    	testRunner(links[i]);
	    }
	  }
	);
}


function listCleaner(links){

	var _domain = h.getDomain();
	var _linkList = [];

	console.log(_domain);


    for (var i = 0; i < links.length; i++){
    	//if (links[i].href == ""){continue;}
    	if (links[i].href.endsWith('#')){continue;}
    	if (inArray(links[i].href, _linkList)){continue;}
    	if (_domain == links[i].host){
    		_linkList.push(links[i].href);	    		
    	}
    }
	return _linkList;
}


function inArray(newValue, currentArray){
	for (var i = 0; i < currentArray.length; i++){
		if (newValue == currentArray[i]){
			return true;
		}
	}

	return false;
}
