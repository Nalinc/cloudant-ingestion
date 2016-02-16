var http = require("http");
var server = http.createServer();
var fs = require( 'fs' );
var path = require( 'path' );
var url = require('url');
var config = require('./config');
var filePath = './data/';
var args = process.argv.slice(2);


var createDb =function(){
	//To do
	console.log('creating database');
	var options = {
		method: 'GET', 
		url:'https://nalinc.cloudant.com/dls-book-search/_all_docs',
		headers: {'Authorization': 'Basic bmFsaW5jOmI0enoxbmc0'}
	};
	http.request(options,function(response){
		console.log(response)
		process.exit(0);
	},function(err){
		console.log(err);
		process.exit(0);
	});
}

var insertFile =function(){
	//To do
	console.log('insertins documents');
	process.exit(0);
}


var insertFiles =function(){
	// Loop through all the files in the temp directory
	fs.readdir( filePath, function( err, files ) {
	        if( err ) {
	        	console.log('check-1')
	            console.log(err);
	        } 
	        files.forEach( function( file, index ) {
	                readFiles(file);
	        } );
	} );
	process.exit(0);
}



function readFiles(fileName){
	var obj = JSON.parse(fs.readFileSync(filePath+fileName, 'utf8'));
	console.log(obj.imgbook['page-number'])
}

var availableCommands = {
	'createDb': createDb,
	'insertDoc': insertFile,
	'bulkInsert': insertFiles
} 

function scriptUsage(){
	console.log('\n\t\t\t--Script Usage--\n');
	console.log('\t1) Create a database\n')	
		console.log('\t\t`node app.js createDb <database_name>`\n');
	console.log('\t2) Insert a single document\n')
		console.log('\t\t`node app.js insertDoc <document_path>`\n');
	console.log('\t3) Bulk insert multiple documents\n')
		console.log('\t\t`node app.js bulkInsert <directory_path>`\n');	
}


server.listen(8080);

if(args[0] in availableCommands){
	if(args[1]){
		availableCommands[args[0]].call()
	}else{
		scriptUsage();
		process.exit(0);
	}
}else{
	scriptUsage();
	process.exit(0);
}
