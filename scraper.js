//scraper.js

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('sync-request');

var linkList = [];

url = 'http://eir.ie';

var res = request('GET', url);
//console.log(res.getBody('utf-8'));


console.log(listBuilder(res));


function listBuilder(response){
	var $ = cheerio.load(response.getBody('utf-8'));
	var links = $('a');

	var linkList = [];
	for (var i = 0; i < links.length; i++){
		var linkHref = links[i].attribs.href;
		if (linkHref == ""){continue;}
		if (linkHref == undefined){continue;}
		if (RegExp("javascript").test(linkHref)){continue;}
		if (inArray(linkHref, linkList)){continue;}

		linkList.push(linkHref);
		
	}

	return linkList;
}


function inArray(newValue, currentArray){
	for (var i = 0; i < currentArray.length; i++){
		if (newValue == currentArray[i]){
			return true;
		}
	}

	return false;
}
