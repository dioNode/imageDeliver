

$(document).ready(function(){

	var globalDataDict = {};
	var globalHeadings = [];

	$("#filename").change(function(e) {
		computeCSVFile(e);
		return false;
	});

	$("#coverFile").change(function(e) {
		computeCoverFile(e);
		return false;
	});

	$("#finalFile").change(function(e) {
		computeFinalFile(e);
		return false;
	});


	$("#backgroundFile").change(function(e) {
		computeBackgroundFile(e);
		return false;
	});

	$("#genPDFBtn").click(function(){
		$("#settings").hide();
		generatePDF();
	})
})

function computeBackgroundFile(e) {
	assertImage(e, "backgroundFile");
}

function computeCoverFile(e) {
	assertImage(e, "coverFile");
}

function computeFinalFile(e) {
	assertImage(e, "finalFile");
}

function assertImage(e, id) {
	var ext = $("input#"+id).val().split(".").pop().toLowerCase();
	if($.inArray(ext, ["jpg", "png","gif","jpeg"]) == -1) {
		alert('Please upload an image');
		return false;
	}
}

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

	var backgroundImg = $("input#backgroundFile").val().split('\\');
	backgroundImg = backgroundImg[backgroundImg.length-1]
	var coverImg = $("input#coverFile").val().split('\\');
	coverImg = coverImg[coverImg.length-1];
	var finalImg = $("input#finalFile").val().split('\\');
	finalImg = finalImg[finalImg.length-1];

	coverPage = `<div class=page id="coverPage"></div>`;
	$("#output").append(coverPage);


	for (var checkBoxIdx=0; checkBoxIdx < checkBoxes.length; checkBoxIdx++) {
		var checkBox = checkBoxes[checkBoxIdx];
		isCheckedList.push(checkBox.checked);
	}
	var page = 0;

	for (var j=0; j < dataDict[globalHeadings[0]].length; j++){
		var nextpage = page+1;
		// var header = `<div class="header">
		// 					<img src="Kaper Kidz KD Logo.png"/>
		// 					<div class="headerText">http://www.eleganter.com.au/</div>
		// 				</div>`;
		var header = `<div class="header">
					</div>`;
		var column = '<div class="column" onclick="promptColour(event)"> \
								<div class="pagename"></div> \
								<div class="pagenum">'+nextpage+'</div> \
							</div>';
		if (j%10 == 0){
			page++;
			if ((page%2 == 0)||($("#singleSide").prop("checked"))){
				var pagelayout = '<div class="page even" id="page'+page+'">'+column+header+'</div>';
			} else {
				var pagelayout = '<div class="page odd" id="page'+page+'">'+column+header+'</div>';
			}
			
			$("#output").append(pagelayout);
			
		}
		var inputrad="";

		fieldString = ''

		for (key in dataDict) {
			headingIdx = globalHeadings.indexOf(key);
			if (isCheckedList[headingIdx]) {
				if (["Image URL","Image","URL"].includes(key.trim())){
					url = dataDict[key][j];
				} else{
					fieldString += '<div><b>'+key+': </b>'+dataDict[key][j]+'</div>';
				}
				
			}
		}

		var product = '<div class="productSpace"> \
				    		<img src="'+url+'"/> \
				    		<div class = "details"> \
				    			'+fieldString+'\
				    		</div> \
				    	</div>'
		var pagenum = "#page"+page;
		$(pagenum).append(product);
	}

	finalPage = `<div class=page id="finalPage"></div>`;
	$("#output").append(finalPage);
	
	backgroundImg = "Image/"+backgroundImg;
	$(".page").css("background","url('"+backgroundImg+"')");
	$(".page").css("background-size","100% 100%");

	coverImg = "Image/"+coverImg;
	$("#coverPage").css("background","url('"+coverImg+"')");
	$("#coverPage").css("background-size","100% 100%");

	finalImg = "Image/"+finalImg;
	$("#finalPage").css("background","url('"+finalImg+"')");
	$("#finalPage").css("background-size","100% 100%");

}