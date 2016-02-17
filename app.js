var http = require("http");
var server = http.createServer();
var request = require("request");

var fs = require( 'fs' );
var path = require( 'path' );
var url = require('url');
var config = require('./config');

var args = process.argv.slice(2);


var createdb =function(dbname){
	//To do
	console.log('creating database: '+dbname);
	var options ={
		'uri': config.cloudantUrl+dbname,
		'method': 'PUT',
		'timeout': 10000,
		'followRedirect': true,
		'maxRedirects': 10,
		'headers': {'Authorization': 'Basic '+config.cloudantKey}
	}
	request(options, function(error, response, body) {
	  console.log(body);
	  console.log('Make sure you change the default database to:'+ dbname+' in "config/index.js"');
	});	
}

var insertFile =function(filepath){
	//To do
	console.log('inserting document: '+filepath);
	var obj = readFiles(filepath);
	var options ={
		'uri': config.cloudantUrl+config.cloudantDB,
		'method': 'POST',
		'timeout': 10000,
		'json':true,
		'body':obj,
		'followRedirect': true,
		'maxRedirects': 10,
		'headers': {'Authorization': 'Basic '+config.cloudantKey}
	}
	request(options, function(error, response, body) {
	  console.log(body);
	});		
}


var insertFiles =function(filepath){
	console.log('reading files from directory: '+filepath)
	// Loop through all the files in the temp directory
	fs.readdir( filepath, function( err, files ) {
	        if( err ) {
	        	console.log('error occured while reading directory!')
	            console.log(err);
	        } 
	        files.forEach( function( file, index ) {
	                var obj = readFiles(filepath+file);
					var options ={
						'uri': config.cloudantUrl+config.cloudantDB,
						'method': 'POST',
						'timeout': 10000,
						'json':true,
						'body':obj,
						'followRedirect': true,
						'maxRedirects': 10,
						'headers': {'Authorization': 'Basic '+config.cloudantKey}
					}
					request(options, function(error, response, body) {
					  console.log(file+' '+JSON.stringify(body));
					});		               	
	        } );
	} );
}

var createDesignDocument= function(docName){
	var designDoc= {
		'_id': '_design/'+docName,
		'indexes': {
			'contentSearch':{
				'analyzer':{
					'name':config.defaultAnalyzer,
					'default': config.defaultLanguage
				},
				'index': config.searchIndex
			}
		}
	}

	var options ={
		'uri': config.cloudantUrl+config.cloudantDB+'_design/'+docName,
		'method': 'PUT',
		'timeout': 10000,
		'json':true,
		'body':designDoc,
		'followRedirect': true,
		'maxRedirects': 10,
		'headers': {'Authorization': 'Basic '+config.cloudantKey}
	}
	request(options, function(error, response, body) {
	  console.log(body);
	});	
}

function readFiles(completefilepath){
	return JSON.parse(fs.readFileSync(completefilepath, 'utf8'));
}

var availableCommands = {
	'createdb': createdb,
	'insertdoc': insertFile,
	'bulkinsert': insertFiles,
	'designdoc': createDesignDocument
} 

function scriptUsage(){
	console.log('\n\t\t\t--Script Usage--\n');
	console.log('\t1) Create a database(rarely needed)\n')	
		console.log('\t\t`node app.js createdb <database_name>`\n');
	console.log('\t2) Insert a single document\n')
		console.log('\t\t`node app.js insertdoc <document_path>`\n');
	console.log('\t3) Bulk insert multiple documents\n')
		console.log('\t\t`node app.js bulkinsert <directory_path>`\n');
	console.log('\t4) Create a design document\n')
		console.log('\t\t`node app.js designdoc <docname>`\n');			
}


server.listen(8080);

if(args[0] in availableCommands){
	if(args[1]){
		availableCommands[args[0]].call(this,args[1])
	}else{
		scriptUsage();
		process.exit(0);
	}
}else{
	scriptUsage();
	process.exit(0);
}
