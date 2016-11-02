//scraper.js

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('sync-request');

var linkList = [];

var url = 'http://qrattend.com';
var domain = 'qrattend.com';
var linkList = [];

//console.log(process.argv[2]);   // command line arguments.  will use for URL


listBuilder(url, domain);
listBuilderReRun(domain, linkList);

//console.log(linkList);

//imageTests(linkList[0]);


testRunner(linkList[0]);


function testRunner(page){

	strucutreTests(page, 'head', true);
	strucutreTests(page, 'nav', true);
	strucutreTests(page, 'article', false);
	strucutreTests(page, 'section', false);
	strucutreTests(page, 'footer', true);
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

		//console.log(images[i].attribs.src);
		//console.log(images[i].attribs.alt);
		//console.log(images[i]);
	}
}

function strucutreTests(page, tag, unique){
	// add multile allowed by setting cases or something like that
	var $ = getPage(page);
	var tags = $(tag);

	if (unique){
		if(tags.lengh)

	} else {

	}

	




	if ((tags.length == 0) && !unique){
		console.log('You should have at least one ' + tag )
	} else if ((tags.length == 0) && unique){
		console.log('You should have only one ' + tag )	
	} else if ((tags.length >=1 ) && !unique){
		console.log( tags.length + tags + 'found: CORRECT')
	} else if ((tags.length >=1 ) && unique){
		console.log( tags.length + tags + 'found: You should not have more than one')
	}
	console.log('*********************************');
	console.log(tag);
	console.log('*********************************');
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
