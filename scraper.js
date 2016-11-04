//scraper.js

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('sync-request');
var jsdom = require('jsdom');

var linkList = [];

var url = 'http://qrattend.com';
var domain = 'qrattend.com';
var linkList = [];

//console.log(process.argv[2]);   // command line arguments.  will use for URL


listBuilder(url, domain);
listBuilderReRun(domain, linkList);

//console.log(linkList);

//imageTests(linkList[0]);

jsdom.env(
  url,
  ["http://code.jquery.com/jquery.js"],
  function (err, window) {
    //console.log("there have been", window.$("head").length, "head");
    //console.log("there have been", window.$("nav").length,  "nav");
    //console.log("there have been", window.$("article").length, "article");
    //console.log("there have been", window.$("section").length, "section");
    structureTests(window.$("head").length, "head", true);
    structureTests(window.$("nav").length, "nav", true);
    structureTests(window.$("article").length, "article", false);
    structureTests(window.$("section").length, "section", false);
    structureTests(window.$("footer").length, "footer", true);
  }
);




//testRunner(linkList[0]);


function testRunner(url){

	var response = getPage(url);
	var $ = cheerio.load(response.getBody());
	structureTests($, 'head', true);
	structureTests($, 'nav', true);
	structureTests($, 'article', false);
	structureTests($, 'section', false);
	structureTests($, 'footer', true);
}


function imageTests(page){
	var $ = getPage(page);
	var images = $('img');
	for (var i=0; i < images.length; i++ ){
		if (typeof images[i].attribs.alt === 'undefined' ) {
    		console.log('issue found');
		}
		if (images[i].attribs.alt == '' ) {
    		console.log('alt text not found on ' + images[i].attribs.src);
		}
	}
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
