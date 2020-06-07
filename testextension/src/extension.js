// Import dependencies
const vscode = require('vscode');
var ref = require("ref-napi");
const ffi = require("ffi-napi");

// typedefs
var Gb = ref.types.void // we don't know what the layout of "myobj" looks like
var GbPtr = ref.refType(Gb);

// Import dynamic library
const vscLibrary = new ffi.Library("lib/./libVSC_SharedLibrary", {
	"Add": ["int", ["int", "int"]],
	"Start": [GbPtr, []],
	"Write": ["void", []]
});

/**
 * @param {vscode.ExtensionContext} context
 */

var listView = {};
// let folderPath = '/home/shakime/Desktop/CodeWorks/testextension/src';
// let folderPath = vscode.workspace.rootPath;
let folderPath = __dirname;
let fileName = '/serialized.json';

function activate(context) {
	console.log('Congratulations, your extension "testextension" is now active!');

	GbPtr = vscLibrary.Start();



	context.subscriptions.push(
		vscode.commands.registerCommand('testextension.hello', function () {
			vscode.window.showInformationMessage('hello');
		})
	);



	context.subscriptions.push(
		vscode.commands.registerCommand('testextension.start', () => {
			vscLibrary.Start();
			// vscLibrary.Write();

			const panel = vscode.window.createWebviewPanel( // Create and show a new webview
				'testCoding', // Identifies the type of the webview. Used internally
				'Test Coding', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{				
					enableScripts: true
				} // Webview options. More on these later.
			);

			const updateWebview = () => {
				readJson(); // read updated content.
				panel.webview.html = getWebviewContent(); // set its HTML content.
				console.log('[WebView-Update]\tDone');

			};

			updateWebview(); // Set initial content
			setInterval(updateWebview, 1000); // schedule updates
		})
	);



	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('testextension.show', () => {
	// 	})
	// );
}


// function writeJson(){
// 	var fs = require('fs');
// 	fs.writeFile(folderPath+fileName, 'utf8', function(err) {
// 	// Dont procede if it's an fail.
// 	   if (err) return console.log(err); 
// 	   return console.log("File \""+fileName+"\" created.");
// 	});
// }


function readJson(){

// Load the json File.
	var fs = require('fs');
	var strData = fs.readFileSync(folderPath+fileName, "utf8");
	var jsData = JSON.parse(strData); // Parse to JavaScript Object
	// console.log(jsData);

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
	var strView = `var table = document.getElementById("table");
	`
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



function getWebviewContent() {
	return `<!DOCTYPE html>
  <html lang="en">
	  <head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Test Manager</title>
  
		  <style>
		  table, th, td {
			  border: 1px solid black;
			  text-align: left;
		  }
		  table#t01 {
			  width: 100%;    
			  background-color: #ffffff;
			  color: black;
		  }
		  </style>
	  </head>
  
	  <body>
  
		  <h2>Test Manager</h2>
  
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










