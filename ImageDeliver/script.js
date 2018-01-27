

$(document).ready(function(){

	var globalDataDict = {};
	var globalHeadings = [];

	$("#filename").change(function(e) {
		computeCSVFile(e);

		return false;

	});

	$("#genPDFBtn").click(function(){
		$("#filename").hide();
		$("#side").hide();
		$("#genPDFBtn").hide();
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

			headings = globalHeadings;
			for (var headingIdx=0; headingIdx < headings.length; headingIdx++) {
				var heading = headings[headingIdx];
				$("#side").append('<p><input class="headingCheckbox" type="checkbox" id="'+heading+'" checked>'+heading+'</p>');
			}
			

		}
		reader.readAsText(e.target.files.item(0));
	}
}

function getDataDictionary(e) {
	var dataDict = {};
	var csvval=e.target.result.split("\n");

	var headings = csvval[0].split(',');
	globalHeadings = headings;
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
	var dataDict = globalDataDict;

	var isCheckedList = [];
	var checkBoxes = $("#side .headingCheckbox");

	for (var checkBoxIdx=0; checkBoxIdx < checkBoxes.length; checkBoxIdx++) {
		var checkBox = checkBoxes[checkBoxIdx];
		isCheckedList.push(checkBox.checked);
	}
	var page = 0;

	for (var j=0; j < dataDict[globalHeadings[0]].length; j++){
		var nextpage = page+1;
		var header = `<div class="header">
							<img src="Kaper Kidz KD Logo.png"/>
							<div class="headerText">http://www.eleganter.com.au/</div>
						</div>';`
		var column = '<div class="column" onclick="promptColour(event)"> \
								<div class="pagename" onclick="promptName(event)">Name</div> \
								<div class="pagenum">'+nextpage+'</div> \
							</div>';
		if (j%10 == 0){
			page++;
			if ((page%2 == 0)&&!($("#singleSide").prop("checked"))){
				var pagelayout = '<div class="page even" id="page'+page+'">'+column+header+'</div>';
			} else {
				var pagelayout = '<div class="page odd" id="page'+page+'">'+column+header+'</div>';
			}
			
			$("#output").append(pagelayout);
			
		}
		var inputrad="";

		sku = "sku";
		name = "name";
		min = "csvvalue[2]";
		carton =" csvvalue[3]";
		url = "csvvalue[7]";
		
		//inputrad = inputrad+sku+name+min+disc+url;

		minimumOrderQtyString = '<div><b>Min order qty: </b>'+min+'</div>';
		cartonQtyString = '<div><b>Carton qty: </b>'+carton+'</div>';
		
		// fieldStrings = {minumumOrderQty: minimumOrderQtyString,
		// 	cartonQty:cartonQtyString,
		// 	originalPrice:originalPriceString,
		// 	discountQty:discountQtyString,
		// 	discount:discountString,
		// 	discountedPrice:discountedPriceString};

		fieldString = ''

		for (key in dataDict) {
			headingIdx = globalHeadings.indexOf(key);
			if (isCheckedList[headingIdx]) {
				fieldString += '<div><b>'+key+': </b>'+dataDict[key][j]+'</div>';
			}
		}

		// for (key in fields){
		// 	if (fields[key] == true){
		// 		fieldString += fieldStrings[key];
		// 		console.log(fieldStrings[key]);
		// 	}
		// }
		
		console.log(fieldString);

		var product = '<div class="productSpace"> \
				    		<img src="'+url+'"/> \
				    		<div class = "details"> \
				    			<div class="sku">'+sku+'</div> \
				    			<div class="name">'+name+'</div> \
				    			'+fieldString+'\
				    		</div> \
				    	</div>'
		var pagenum = "#page"+page;
		$(pagenum).append(product);
	}
	

}