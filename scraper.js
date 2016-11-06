//scraper.js

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('sync-request');
var jsdom = require('jsdom');
var asyncreq = require('request')

var linkList = [];

var url = 'http://localhost/Assignment2/vincent/k00223361_VincentLee_Assignment2/lebanese_website';
var domain = 'localhost/Assignment2/vincent/k00223361_VincentLee_Assignment2/lebanese_website';
var linkList = [];

//console.log(process.argv[2]);   // command line arguments.  will use for URL


listBuilder(url, domain);
listBuilderReRun(domain, linkList);

testRunner(url);

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
	
	var testURL = (url + '/' + testDir + '/');

	asyncreq(testURL, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(testURL, 'FOUND');
	  } else{
	  	console.log(testURL, response.statusCode);
	  }

	})
}




//testRunner(linkList[0]);

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


function getPage(url){
	var response = request('GET', url);
	//return cheerio.load(response.getBody('utf-8'));
	return response;
}

function listBuilder(url, domain){
	// LOOK AT REWRITE USING JSDOM...


	var response = request('GET', url);
	var $ = cheerio.load(response.getBody('utf-8'));
	var links = $('a');

	for (var i = 0; i < links.length; i++){
		var linkHref = links[i].attribs.href;
		if (linkHref == ""){continue;}
		if (linkHref == undefined){continue;}
		if (RegExp("javascript").test(linkHref)){continue;}
		if (inArray(linkHref, linkList)){continue;}
		if (RegExp("^\/").test(linkHref)){
			linkHref = url + linkHref
		}
		if (!RegExp(domain).test(linkHref)){continue;}

		linkList.push(linkHref);

		//listBuilder(linkHref);  // recursive call
	}

	return linkList;
}

function listBuilderReRun(domain, list){
	for (var i = 0; i < list.length; i++){
		linklist = listBuilder(list[i], domain);
	}

}

function inArray(newValue, currentArray){
	for (var i = 0; i < currentArray.length; i++){
		if (newValue == currentArray[i]){
			return true;
		}
	}

	return false;
}
