//scraper.js

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('sync-request');

var linkList = [];

var url = 'http://qrattend.com';
var domain = 'qrattend.com';
var linkList = []


listBuilder(url, domain);
listBuilderReRun(domain, linkList);

console.log(linkList);

imageTests(linkList[0]);

function imageTests(page){
	var $ = getPage(page);
	var images = $('img');

	console.log(images[0].attribs.src)
	console.log(images[0].attribs.alt)

}






function getPage(url){
	var response = request('GET', url);
	return cheerio.load(response.getBody('utf-8'));
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
