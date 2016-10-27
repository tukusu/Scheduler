var sec=0;
var count=0;
var measure=false;
var subject="";
var difficulty=0;
var deadLine=new Array();
var num=0;
var electron = require('electron');
var ipc=require('electron').ipcRenderer;
var received=false;
var averageTime=0;
var pastTaskNum=window.localStorage.getItem("pastTaskNum");
var timeRequied=0;
if(pastTaskNum==null) pastTaskNum=0;
//alert(pastTaskNum);

//window.localStorage.clear();

if(window.localStorage.getItem("num")!=null){
	num=window.localStorage.getItem("num");
	document.write("<div align='right'><h3>進行中のタスク</h3></div>");
}

for(var i=0;i<num;i++){
	if(window.localStorage.getItem("task"+i)!=null){
		document.write("<div align='right'><input type='button'"+" value='"+window.localStorage.getItem("task"+i)+"' id='task"+i+"' onClick=loadTask(this)> </div>");
	}
}

function make(){
	deadLine=new Array();
	subject=document.getElementById("text").value.replace(/ /g,"").replace(/　/g,"");
	difficulty=Number(document.getElementById("difficulty").value.replace(/ /g,"").replace(/　/g,""));
	for(var i=0;i<4;i++){
		deadLine.push(Number(document.getElementById("deadLine"+i).value.replace(/ /g,"").replace(/　/g,"")));
		if(deadLine[i]==""){
			alert("期限を入力してください");
			return 0;
		}
	}
	if(subject==""){
		alert("タイトルを入力してください");
	}
	else
	if(difficulty==""){
		alert("文字数を入力してください");
	}
	else{
		document.getElementById("subject").innerHTML="<h1>"+subject+"</h1>";
		save(subject,0,0,difficulty,deadLine);
	}
	timeRequired = calcRequiredTime( checkAverageTime(),difficulty );
	alert(timeRequired);
}

function start(){
	startShowing();
}

function stop(){
	stopShowing();
}

function finish(){
	stopShowing();
	for(var i=0;i<num;i++){
		if(window.localStorage.getItem("task"+i)==subject){
			window.localStorage.removeItem("task"+i);
		}
		break;
	}
	window.localStorage.setItem("pastTask"+pastTaskNum,subject);
	pastTaskNum++;
	window.localStorage.setItem("pastTaskNum",pastTaskNum);
	alert("タスク「" + subject + "」が終了しました");
}

function loadTask(button){
	load(button.value);
}

function checkAverageTime(){
	var average=0;
	for(var i=0;i<pastTaskNum;i++){
		var tName = window.localStorage.getItem("pastTask"+i);
		average += window.localStorage.getItem(tName+":difficulty") / window.localStorage.getItem(tName+":time");
		//alert(average);
	}
	if(pastTaskNum>0){
		average/=pastTaskNum;
	}
	return average;
}

function calcRequiredTime(t,dif){
	var res = 0;
	if(t > 0){
		res = dif / t;
	}
	return res;
}

function startShowing() {
	if(measure==false){
		measure=true;
		PassageID = setInterval('showPassage()',1000);
	}
}
// 繰り返し処理の中止
function stopShowing() {
	if(measure==true){
		measure=false;
		clearInterval( PassageID );
		save(subject,time,count,difficulty,deadLine);
	}
}
// 繰り返し処理の中身
function showPassage() {
	sec++;
	document.getElementById("time").innerHTML="time: "+sec+"sec";
}


document.onkeydown=function(){
	if(measure==true){
		count++;
		document.getElementById("count").innerHTML="count: "+count;
	}
}

function save(sub,time,count,dif,dead){
	num=0;
	if(window.localStorage.getItem("num")!=null){
		num=window.localStorage.getItem("num");
	}
	window.localStorage.setItem(sub,sub);
	window.localStorage.setItem(sub+":time",sec);
	window.localStorage.setItem(sub+":count",count);
	window.localStorage.setItem(sub+":difficulty",dif);
	window.localStorage.setItem(sub+":deadLine",dead);
	for(var i=0;i<num;i++){
		if(window.localStorage.getItem("task"+i)==subject){
			break;
		}
		if(i==num-1){
			alert("新しいタスク「"+sub+"」が追加されました");
			window.localStorage.setItem("task"+num,sub);
			num++;
			window.localStorage.setItem("num",num);
		}
	}
	if(num==0){
		alert("新しいタスク「"+sub+"」が追加されました");
		window.localStorage.setItem("task"+num,sub);
		num++;
		window.localStorage.setItem("num",num);
	}
}

function load(sub){
	subject=window.localStorage.getItem(sub);
	sec=window.localStorage.getItem(sub+":time");
	count=window.localStorage.getItem(sub+":count");
	difficulty=window.localStorage.getItem(sub+":difficulty");
	document.getElementById("time").innerHTML="所要時間: "+sec+"sec";
	document.getElementById("count").innerHTML="タイプ数: "+count;
	var temp="";
	deadLine=window.localStorage.getItem(sub+":deadLine");
	document.getElementById("deadText").innerHTML="期限: "+deadLine;
	document.getElementById("difText").innerHTML="文字数: "+difficulty;
	document.getElementById("subject").innerHTML="<h1>"+sub+"</h1>";
}

function emmit(){
	ipc.send('asynchronous-message', { value:1, value2:0});
	if(received==false){
		ipc.on('asynchronous-reply', function(response,arg) {
			alert(arg);
			received=true;
		});
	}
	received=false;
}

ipc.on('asynchronous-message', function(event, arg) {
	alert();
});

function remove(){
	window.localStorage.clear();
}

window.onblur = function (){
	window.focus();
}

window.onfocus=function(){

}