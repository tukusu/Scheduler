'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var async=require('async');
var ipc = electron.ipcMain;
var spawn=require('child_process').spawn;
var ls=spawn('sudo',['-S' , 'src/logger']);
var mainWindow = null;
var num=0;

app.on('window-all-closed', function() {
  ls.kill();
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

app.on('activate',function(){
	if(mainWindow==null){
		mainWindow = new BrowserWindow({width: 800, height: 600});
  		mainWindow.loadURL('file://' + __dirname + '/index.html');
  	}
});

ls.stdout.on('data',(data) => {
  num++;
});

ls.stderr.on('data', function (data) {
  //console.log('' + data);
  //ls.stdout.write("s19941024\n");
  //process.stdin.write("s19941024\n");
});

ipc.on('asynchronous-message', function(event, arg) {
  switch(arg.value){
    case 0:
      num=arg.value2;
      break;
    case 1:
      event.sender.send('asynchronous-reply', num);
      break;
  }
});