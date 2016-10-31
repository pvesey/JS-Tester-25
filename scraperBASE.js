//scraper.js

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

url = 'http://qrattend.com';

var returedLinks = getLinks(url);

console.log(returedLinks);


function getLinks(url){
	var a = request(url, requestHelper);
	console.log(a);	
}



function requestHelper(error, response, html){

    if(!error){
        var $ = cheerio.load(html);

        var _linklist = [];

		var links = $('a');

		for (var i = 0; i < links.length; i++){
			_linklist.push(links[i].attribs.href);
		}
		console.log(_linklist);

    } else {

    	console.log("Aww Snap.. something went wrong");
    }

    return _linklist;
};

