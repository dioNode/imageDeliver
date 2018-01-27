$(document).ready(function(){

	fields = {minumumOrderQty: true,
		cartonQty: true,
		originalPrice: true,
		discountQty: true,
		discount: true,
		discountedPrice: true};

	$("#filename").change(function(e) {
		var ext = $("input#filename").val().split(".").pop().toLowerCase();

		if($.inArray(ext, ["csv"]) == -1) {
			alert('Upload CSV');
			return false;
		}
	    
		var sku;
		var name;
		var min;
		var price;
		var disc;
		var url;
		var page = 0;

		if (e.target.files != undefined) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var csvval=e.target.result.split("\n");

				adjustFields();


				console.log(csvval.length);
				for (var j=0; j<csvval.length-1; j++){
					var nextpage = page+1;
					var header = '<div class="header"> \
										<img src="Kaper Kidz KD Logo.png"/> \
										<div class="headerText">http://www.eleganter.com.au/</div> \
									</div>';
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
					var csvvalue=csvval[j].split(",");
					var inputrad="";
					sku = csvvalue[0];
					name = csvvalue[1];
					min = csvvalue[2];
					carton = csvvalue[3];
					price = parseInt(csvvalue[4]).toFixed(2);
					discount = csvvalue[5];
					if (discount == ""){
						discount = 10;
					}
					disc = csvvalue[6];
					url = csvvalue[7];
					console.log(url);
					discountedPrice = (parseInt(price.replace('$','')) * (1-discount/100)).toFixed(2);
					//console.log(discountedPrice);

					inputrad = inputrad+sku+name+min+disc+url;

					minimumOrderQtyString = '<div><b>Min order qty: </b>'+min+'</div>';
					cartonQtyString = '<div><b>Carton qty: </b>'+carton+'</div>';
					originalPriceString = '<div><b>Original price:</b> $'+price+'</div>';
					discountQtyString = '<div><b>Discount qty: </b>'+disc+'</div>';
					discountString = '<div><b>Discount:</b>'+discount+'%</div>';
					discountedPriceString = '<div><b>Disc price:</b> $'+discountedPrice+'</div>';

					fieldStrings = {minumumOrderQty: minimumOrderQtyString,
						cartonQty:cartonQtyString,
						originalPrice:originalPriceString,
						discountQty:discountQtyString,
						discount:discountString,
						discountedPrice:discountedPriceString};

					fieldString = ''

					for (key in fields){
						if (fields[key] == true){
							fieldString += fieldStrings[key];
							console.log(fieldStrings[key]);
						}
					}
					
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
					//console.log(inputrad);
					
				};				
			}
			reader.readAsText(e.target.files.item(0));
		}
		$("#filename").hide();
		$("#side").hide();

		return false;

	});
})

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

function genPDF(){
    var doc = new jsPDF();          
	var elementHandler = {
	  '#ignorePDF': function (element, renderer) {
	    return true;
	  }
	};
	var source = window.document.getElementsByTagName("body")[0];
	doc.fromHTML(
	    source,
	    15,
	    15,
	    {
	      'width': 180,'elementHandlers': elementHandler
	    });

	doc.output("dataurlnewwindow");
}

function genPDF2(){
	var pdf = new jsPDF();
	pdf.addHTML($('body')[0], function () {
	    pdf.save('Test.pdf');
	});
	var elementHandler = {
	  '#ignorePDF': function (element, renderer) {
	    return true;
	  }
	};
	var source = window.document.getElementsByTagName("body")[0];
	doc.fromHTML(
	    source,
	    15,
	    15,
	    {
	      'width': 180,'elementHandlers': elementHandler
	    });

	doc.output("dataurlnewwindow");
}
