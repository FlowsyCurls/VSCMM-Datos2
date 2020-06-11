// Import dependencies
const vscode = require('vscode');
const { error } = require('console');

// Variables
/*path*/
const folderPath = __dirname;
var fileName = '/serialized.json';
/*functionality*/
var listView = {}; //gethtml
var toggleMemory = '0'; //indicate remote or local.
/*interface*/
var userName="";
const localColor = 'rgb(' + [127, 26, 26].join(',') + ')';
const remoteColor = 'rgb(' + [115,173,33].join(',') + ')';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	console.log('Extension "memorymanager" is now active!\n');
	clearJson();

	context.subscriptions.push(
		vscode.commands.registerCommand('memorymanager.start', () => {

			const panel = vscode.window.createWebviewPanel( // Create and show a new webview
				'memoryManager', // Identifies the type of the webview. Used internally
				'Memory Manager', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{enableScripts: true} // Webview options. More on these later.
			);

			const updateWebview = () => {
				getToggleStatus();
				setListView(); // read updated content.
				panel.webview.html = getWebviewContent(); // set its HTML content.
				// console.log('[Table-Update]\tDone');

			};
			updateWebview(); // Set initial content
			setInterval(updateWebview, 500); // schedule updates

			// Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					
					switch (message.command) {
						case 'local':
							switchToggle('0');
							vscode.window.showInformationMessage("Using " + getToggleName() + " memory.");
							return;
					}
					switch (message.command) {
						case 'remote':
							if (goRemote(message.text))
								vscode.window.showInformationMessage("Using " + getToggleName() + " memory.");
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);
}

/*
============================================
           Background Functions.
============================================
*/
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
		// console.log(' +[Debug][File]\t\tRead.');
		// console.log(data);
		if (data=='')
			console.log('mierda');
		var jsData = JSON.parse(data); // Parse to JavaScript Object
		// console.log(jsData);
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

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec*1000));
}

async function goRemote(data){
	console.log('[Process][Link]\t\tIn Process...');
//  ParseEntry
	let info = parseUserInfoToJson(data);
	if (info=='') {
		switchToggle('1');
		await sleep(1);
		vscode.window.showErrorMessage("Error attempting to connect.");
		switchToggle('0');

		return false;
	}
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

//  Connect to Server.
	if (!establishConnection()){
		return false;
	};
	userName=jsData.userInfo.username;
	switchToggle('1');
	console.log('[Process][Link]\t\tSuccessfully...!\n');
	return true;
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

function establishConnection(){
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
	toggleMemory = toggle;
	console.log('[Debug][Toggle]\t\tShift : '+toggle);
	getToggleStatus();
}


/*
============================================
           Interface Functions.
============================================
*/
function setListView(){
	var jsData = readJson();
	var rowsList = [];
	if(jsData.gbSetsList != null){ // Ensure that we have Sets to read.
		for (var i=0; i< jsData.gbSetsList.length; i++){ // For each element inside gbSetsList
			var	rowInfo = []; // Locate every item information in the corresponding column.
			rowInfo[0] = JSON.stringify(jsData.gbSetsList[i].id);
			rowInfo[1] = JSON.stringify(jsData.gbSetsList[i].vsAddress);
			rowInfo[2] = JSON.stringify(jsData.gbSetsList[i].refCount);
			rowInfo[3] = JSON.stringify(jsData.gbSetsList[i].type);
			rowInfo[4] = JSON.stringify(jsData.gbSetsList[i].value);
			rowInfo[5] = JSON.stringify(jsData.gbSetsList[i].valAddress);
			rowsList.push(rowInfo); // Push content.
		}
	}
	listView = rowsList;

}


function setTable(){
	// See if remote is active.
	var strView;
	(toggleMemory == '1') ? strView = `var table = document.getElementById("table"); `+ switchInterfaceObjects('1') 
		:  strView = `var table = document.getElementById("table"); `+ switchInterfaceObjects('0');
	
	// Fill the table with the listView rows information.
	for (var i=0; i< listView.length; i++){
		strView = strView + 
		`
		var row = table.insertRow();
		var cell1 = row.insertCell();
		var cell2 = row.insertCell();
		var cell3 = row.insertCell();
		var cell4 = row.insertCell();
		var cell5 = row.insertCell();
		var cell6 = row.insertCell();
		cell1.innerHTML = ` + listView[i][0] + `;
		cell2.innerHTML = ` + listView[i][1] + `;
		cell3.innerHTML = ` + listView[i][2] + `;
		cell4.innerHTML = ` + listView[i][3] + `;
		cell5.innerHTML = ` + listView[i][4] + `;
		cell6.innerHTML = ` + listView[i][5] + `;
		`
	}
	return strView;
}


function switchInterfaceObjects(status){
	if (status == '0'){
		return `
		document.getElementById("localBtn").disabled = true;

		document.getElementById("userLabel").style.display = 'none';

		document.getElementById("localBtn").style.backgroundColor = 'rgb(' + [115,173,33].join(',') + ')';
		document.getElementById("remoteBtn").style.backgroundColor = 'rgb(' + [127, 26, 26].join(',') + ')';
		`
	} else {
		return `
		document.getElementById("username").hidden = true;
		document.getElementById("password").hidden = true;
		document.getElementById("ip").hidden = true;
		document.getElementById("port").hidden = true;

		document.getElementById("remoteBtn").disabled = true;

		document.getElementById("userLabel").style.display = 'block';
		
		document.getElementById("localBtn").style.backgroundColor = 'rgb(' + [127, 26, 26].join(',') + ')';
		document.getElementById("remoteBtn").style.backgroundColor = 'rgb(' + [115,173,33].join(',') + ')';
		`
	}

}


function getWebviewContent() {
	return `<!DOCTYPE html>
  <html lang="en">
	  <head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Test Manager Title</title>

		  <style>

			table {
				width: 50%;    
				background-color: #101010;
				color: white;
				color: solid gray;
				border: 3px solid #73AD21;
				border-radius: 12px;
			}

			th, td {
				padding: 7px;
				text-align: center;
				font-size:14px;
			}
			tr#titles{
				border: 1px solid white;
			}
			
			label#remote{
				display: inline-block;
				font-size:18px;
				font-color:#73AD21;
				width:70px;
			}

			input{
				-webkit-appearance: none!important;
				border: 3px solid #73AD21;
				border-radius: 100px;
				padding: 15px;
				width: 180px;
				height: 8px;
			}
			
			button#localBtn{
				background-color: `+localColor+`;
			}

			button#remoteBtn{
				background-color: `+remoteColor+`;
			}

			button{
				border: 3px solid black;
				border-radius: 100px;
				color: solid gray;
				width: 70px;
				height: 35px;
				font-weight:bold;
			}
			
			label{
				border-radius: 8px;
				background-color: black;
				border: 3px solid black;
				color: white;
				font-size:20px;
				padding-right: 12px;
				padding-left: 12px;
				padding-top: 7px;	
				padding-bottom: 7px;
			}

			.flex-container {
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
			  }
			  
			.flex-container > div {
				margin: 5px;
				align-items: center;
			}

		  </style>
	  </head>
  
	  <body>
		  <h1>Memory Manager</h1>
		  
			<div class="flex-container">
			<div> <button id="localBtn" onclick=switchToLocal()>Remote</button> </div>
			<div> <button id="remoteBtn" onclick=switchToRemote()>Remote</button> </div>
			<div> <input type="text" placeholder="username" id="username" maxlength="20"/> </div>  
			<div> <input type="text" placeholder="password" id="password" maxlength="20"/> </div>
			<div> <input type="text" placeholder="IP" id="ip" maxlength="20"/> </div>
			<div> <input type="text" placeholder="port" id="port" maxlength="20"/> </div>
			<div> <label id="userLabel">Online</label> </div>
			</div>
			<dr>
		  <hr>
		  
		  <h2> &#8620 Visualizer &#8619 </h2>
		  <table id="table">
			  <tr> 
				<th>ID</th>
				<th>Address</th> 
				<th>refCount</th>
				<th>Type</th>
				<th>Value</th>
				<th>ValAddress</th>
			  </tr>
			  
		  </table>

		  <script>
		  ` + setTable()  + `

			function switchToLocal(){
				const vscode = acquireVsCodeApi();
				vscode.postMessage({
					command: 'local'
				})
			}

			function switchToRemote(){
				const vscode = acquireVsCodeApi();
				var info = document.getElementById("username").value 
					+ ',' + document.getElementById("password").value 
					+ ',' + document.getElementById("ip").value 
					+ ',' + document.getElementById("port").value;
				vscode.postMessage({
					command: 'remote',
					text: info
				})
			}

	

	  	  </script>
  	  </body>
	</html>`;
}


exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}