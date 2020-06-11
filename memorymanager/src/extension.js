
const vscode = require('vscode');
const { error } = require('console');

// Variables
/*path*/
const folderPath = __dirname;
let fileName = '/serialized.json';
/*functionality*/
var listView = {}; //gethtml
var toggleMemory = '0'; //indicate remote or local.

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	console.log('Extension "memorymanager" is now active!\n');
	clearJson();

	let disposable = vscode.commands.registerCommand('memorymanager.helloWorld', function () {
		
		// getToggleStatus();
		// console.log(getToggleName());
		// switchToggle('1');
		linkUser('Ans,324,D2sp2es,3f3os');
		// switchToggle('1');
		// switchToggle('0');
		vscode.window.showInformationMessage('Hello World from memorymanager!');
	});

	context.subscriptions.push(disposable);
}

function clearJson(){
	var fs = require('fs');
	// console.log(folderPath+fileName);
	let json = JSON.stringify({ remoteToggle: '0', 
								connected: '0', userInfo:[], 
								gbSetsList:[] }, null, 4);
	console.log('[Init][Debug][File]\t\tCleared.');							
	writeJson(json);
}

function readJson(){
	var fs = require('fs');	
	try {
		let data = fs.readFileSync(folderPath+fileName, 'utf8');
		if (data==null) console.error("WTF");
		console.log(' +[Debug][File]\t\tRead.');
		// console.log(data);
		if (data=='')
			console.log('mierda');
		var jsData = JSON.parse(data); // Parse to JavaScript Object
		console.log(jsData);
		return jsData;
	} catch(e) {
		throw console.error('[Error][File]\tFile '+fileName+' couldn\'t be read.\n\n'+e.stack);
	}
}

function writeJson(content){
	try {
		var fs = require('fs');
		fs.writeFileSync(folderPath+fileName, content,'utf8');
		console.log(' +[Debug][File]\t\tWritten.');
		return true;
	} catch(e) {
		// An error occurred
		throw console.error('[Error][File]\tFile '+fileName+' couldn\'t be writen.\n\n'+e.stack);
	}


}


function linkUser(data){
	console.log('[Process][Link]\t\tIn Process...');
//  ParseEntry
	let info = parseUserInfoToJson(data);
	if (info==null) return false;
//  Push in json.
	if(!writeJson(info)){
		vscode.window.showInformationMessage("Error attempting to connect.");
		console.log(' -[Error][UserInfo]\tFile '+fileName+'couldn\'t be written.');
		return;
	}
	/*=== SHOW === */
	console.log(' +[Debug][Info]\t\tAdded.');
	let jsData = JSON.parse(info.toString()); // Parse to JavaScript Object
	console.log(jsData.userInfo);
	/*=== SHOW === */

//  Connect Cliente to Server.
	if (!linkUserClientToServer()){
		vscode.window.showInformationMessage("Error attempting to connect.");
		return;
	};
	switchToggle('1');
	console.log('[Process][Link]\t\tSuccessfully...!\n');
	return;
}

function parseUserInfoToJson(data){
	let array = data.split(',');
	if ('' == array[0] ||'' == array[1] ||'' == array[2] ||'' == array[3]) return false;
	let userInfo = {username:array[0],password:array[1],ip:array[2],port:array[3]};

	let fileData = readJson();
	let json = JSON.stringify({ remoteToggle: fileData.remoteToggle,
								connected: fileData.connected,
								userInfo: userInfo,
								gbSetsList:fileData.gbSetsList }, null, 3);	
	console.log(' +[Debug][User]\t\tParse.');
	// console.log(json);
	return json;	
}

function linkUserClientToServer(){
	// console.log('-[Error][Socket]\tcouldn\'t be written.');
	console.log(' *[Sub][Socket]\t\tIn Process..');
	console.log('   [Info][Socket]\tWaiting connection...');
	console.log('   +[Debug][Socket]\tConnected!');
	// throw console.error('[Error][Socket]\tcouldn\'t be written.');
	console.log(' *[Sub][Socket]\t\tDone.');

	// console.log(fileData);
	/*
	CONECTARSE AL SERVER;
	*/
	return true;
}

function getToggleStatus(){
	let jsData = readJson();
	if (jsData==null) return;
	toggleMemory = jsData.remoteToggle;
	console.log('[Debug][Toggle]\t\tShift : '+toggleMemory);
}

function getToggleName(){
	return (toggleMemory=='0') ? 'local' : 'remote';
}

function switchToggle(toggle) {
	let json = readJson();
	json.remoteToggle = toggle;
	let shifted = JSON.stringify({ remoteToggle: json.remoteToggle,
									connected: json.connected,
									userInfo: json.userInfo,
									gbSetsList: json.gbSetsList }, null, 3);	
	writeJson(shifted);
	getToggleStatus();
}

exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}