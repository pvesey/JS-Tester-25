//scraper.js

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var linkList = [];

url = 'http://eir.ie';



function getLinks(url, htmlLinks){
	request(url, function(error, response, html){
	    if(!error){
	      var $ = cheerio.load(html);
	      var links = $('a');

	      for (var i = 0; i < links.length; i++){
	      	if (links[i].attribs.href == 'javascript:void(0);'){
	      		continue;
	      	}
	      	if (links[i].attribs.href == 'undefined'){
	      		continue;
	      	}
	      	if (links[i].attribs.href == undefined){
	      		continue;
	      	}

			linkList.push(links[i].attribs.href);
		  }
	    }
		htmlLinks(null, linkList);
	})
}

getLinks(url, function(err, htmlLinks){
	for (var i = 0; i < linkList.length; i++){
		getLinks(linkList[i], function(err, htmlLinks){

		})
	}
	console.log(linkList)
})







