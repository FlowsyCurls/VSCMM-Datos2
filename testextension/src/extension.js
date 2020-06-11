// Import dependencies
const vscode = require('vscode');


// Variables
/*path*/
const folderPath = __dirname;
let fileName = '/serialized.json';
let linkFile = '/linkUser.json';
/*functionality*/
var listView = {}; //gethtml
var toggleMemory = '0'; //indicate remote or local.
/*colors*/
const localColor = 'rgb(' + [127, 26, 26].join(',') + ')';
const remoteColor = 'rgb(' + [115,173,33].join(',') + ')';

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	console.log('Congratulations, your extension "memorymanager" is now active!');

	console.log(folderPath+fileName);
	clearJson();

	context.subscriptions.push(
		vscode.commands.registerCommand('testextension.start', () => {

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
							switchToggle('1');

							if(linkUser(message.text)){
								// switchToggle('1');
								vscode.window.showInformationMessage("Using " + getToggleName() + " memory.");
							}
							else {
								// switchToggle('1');
								vscode.window.showInformationMessage("Error attempting to connect.");
							}
							
							return;
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);
}

function linkUser(data){
	// return true;
	// ParseEntry
	var info = parseUserInfo(data);
	if (!info) return false;
	// Push in json.
	if(!writeJson(folderPath+linkFile, info)){
		console.error('[UserInfo-Error]\t'+'Not written.');
	}
	console.log('[UserInfo-ADDED]\t'+ info);
	return linkUser_Client;
}




function parseUserInfo(data){
	var array = data.split(',');
	if ('' == array[0] ||'' == array[1] ||'' == array[2] ||'' == array[3]) return false;
	let userInfo = {username:array[0],password:array[1],ip:array[2],port:array[3]};
	return userInfo;	
}


function clearJson(){
	var fs = require('fs');
	toggleMemory ='0';
	var json = JSON.stringify({ remoteToggle: '0', gbSetsList:[] }, null, 3);
	fs.writeFile(folderPath+fileName, json,'utf8', function(err) {
		var data = (!err) ? '[Json-Cleared]\t'+ 'Done' : "Error writing file \""+fileName+"\".";
		console.log(data);
	});
}


function readJson(){
	// Load the json File.
	var fs = require('fs');	
	fs.open(folderPath+fileName, 'utf8', function(err, fd) {
		var finalize = function(buffer) {
			fs.close(fd);
			console.log(buffer);
		};
	
		if (err) {
			finalize();
			return;
		}


	fs.read(folderPath+fileName, 'utf8', function(err) {
		if (err) return null;
	});
	var strData = fs.readFileSync(folderPath+fileName, 'utf8');
	var jsData = JSON.parse(strData); // Parse to JavaScript Object
	return jsData
}


function writeJson(path, content){
	console.log(path +'  '+ content);
	return true;
	// var fs = require('fs');
	// fs.writeFile(folderPath+path, content, 'utf8', function(err) {
	// // Dont procede if it's an fail.
	// 	if (err) {return false}
	// });
	// return true;
}


function readToggle(){
	var jsData = readJson();
	if (jsData==null) return;
	toggleMemory = jsData.remoteToggle;
}


function getToggleStatus(){
	readToggle();
	// console.log('[Toggle-Status]\t'+ toggleMemory);
	return toggleMemory;
}


function getToggleName(){
	return (toggleMemory=='1') ? 'remote' : 'local';
}


function switchToggle(data){
	var jsData = readJson();
	jsData.remoteToggle = data;
	console.log(jsData.remoteToggle);
	var edited = JSON.stringify({ remoteToggle: data, gbSetsList: jsData.gbSetsList }, null, 3);
	var path = folderPath+fileName;
	console.log(path);
	(writeJson(path,edited)) ? toggleMemory=data : data='Error';
	console.log('[Toggle-Switched]\t'+ data);
	return;
}


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
				border: 2px solid black;
				border-radius: 100px;
				color: solid gray;
				width: 70px;
				height: 35px;
				font-weight:bold;
			}

		  </style>
	  </head>
  
	  <body>
		  <h1>Memory Manager</h1>
		  <form>
		  
		 	<button id="localBtn" onclick=switchToLocal()>Local</button>
			<button id="remoteBtn" onclick=switchToRemote()>Remote</button>
		    <input type="text" placeholder="username" id="username" maxlength="20"/>
		    <input type="text" placeholder="password" id="password" maxlength="20"/>
		    <input type="text" placeholder="IP" id="ip" maxlength="20"/>
			<input type="text" placeholder="port" id="port" maxlength="20"/>
			
		  </form>
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