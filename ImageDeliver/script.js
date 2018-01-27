

$(document).ready(function(){

	var globalDataDict = {};

	$("#filename").change(function(e) {
		computeCSVFile(e);
		//$("#filename").hide();
		//$("#side").hide();

		return false;

	});

	$("#genPDFBtn").click(function(){
		generatePDF();
	})
})

/** Generates a dictionary containing all the csv file data **/
function computeCSVFile(e) {
	var ext = $("input#filename").val().split(".").pop().toLowerCase();

	if($.inArray(ext, ["csv"]) == -1) {
		alert('Upload CSV');
		return false;
	}

	if (e.target.files != undefined) {
		var reader = new FileReader();
		reader.onload = function(e) {

			// Put all csv processing here
			getDataDictionary(e);

			headings = Object.keys(globalDataDict);
			console.log(headings);
			for (var headingIdx=0; headingIdx < headings.length; headingIdx++) {
				var heading = headings[headingIdx];
				$("#side").append('<p><input type="checkbox" id="'+heading+'" checked>'+heading+'</p>');
			}
			

		}
		reader.readAsText(e.target.files.item(0));
	}
}

function getDataDictionary(e) {
	var dataDict = {};
	var csvval=e.target.result.split("\n");

	var headings = csvval[0].split(',');
	var csvValueList = [];

	for (var headingIdx=0; headingIdx < headings.length; headingIdx++){
		csvValueList.push([]);
	}

	for (var rowIdx=1; rowIdx < csvval.length-1; rowIdx++) {
		var columnValues = csvval[rowIdx].split(',');
		for (var colIdx=0; colIdx < columnValues.length; colIdx++) {
			csvValueList[colIdx].push(columnValues[colIdx]);
		}
	}

	for (var headingIdx=0; headingIdx < headings.length; headingIdx++) {
		dataDict[headings[headingIdx]] = csvValueList[headingIdx];
	}
	globalDataDict = dataDict;
}

function adjustFields(){
	for (var key in fields){
		if (!$("#"+key).prop("checked")){
			fields[key] = false;
		}
	}
	console.log(fields);
}

function promptColour(event){
	var colour = window.prompt("Please enter hex colour code");
	$(event.target).css("background-color",colour);
	$(event.target).parent().children(".header").children(".headerText").css("color",colour);
	$(event.target).parent().children(".header").children(".headerText").css("border-bottom-color",colour);
}

function promptName(event){
	var name = window.prompt("Change name to?");
	$(event.target).text(name);
	event.stopPropagation();
}

function generatePDF() {
	console.log(globalDataDict);
}