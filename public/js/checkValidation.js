$(document).ready(function () {

	$("#checkout").hide();

	// Validate and proceed
	$("#checkoutProceed").click(function (e) {
		e.preventDefault();

		if (validatePreEntries()) {
			console.log("Ready to proceed");
			var numPasses = $("#numPassesSelect").val();
			$("#checkoutProceed").remove();
			// Lock final fields and calculate amount
			lockFinalFields(numPasses);
			// Populate valid details fields
			generateFields(numPasses);
			$("#checkout").show();
		} else {
			console.log("Pre-check failed");
		}
	});


	$("#checkout").click(function (e) { 
		e.preventDefault();

		var fields = $("#fields input");
		var formData = {};

		for (var i = 0; i < fields.length; i++) {
			formData[fields[i].name] = fields[i].value;
		}
		formData['numPasses'] = $("#numPassesSelect").val();
		formData['passType'] = $("#passTypeInput").val();

		console.log(formData);
		
		$.post("/pay/checkout", formData,
			function (resp) {
				console.log(resp);
				var transactionPack = resp;
				console.log(transactionPack);
				
				//- prod: https://securegw.paytm.in/theia/processTransaction
				//- staging: https://securegw-stage.paytm.in/theia/processTransaction
				$("body").append($('<form id="f2" action="https://securegw.paytm.in/theia/processTransaction" method="post" style="visibility: hidden;"></form>'));

				for (var key in transactionPack) {
					$("#f2").append("<input name='" + key + "' " + "value='" + transactionPack[key] + "'/>");
				}
				$("#f2").submit();
			},
			"json"
		);
	});

});

function validatePreEntries() {
	var proper = true;
	// Check phone number length
	var phoneLength = $("#phoneInput").val().length;
	var emailProvider = $("#emailInput").val().split("@");
	console.log(phoneLength);
	console.log(emailProvider);
	if (phoneLength !== 10) {
		proper = false;
		$("#phoneInput").addClass('is-invalid');
	}
	if (emailProvider.length == 0) {
		proper = false;
		$("#emailInput").addClass('is-invalid');
	}
	return proper;
}

function lockFinalFields(numPasses) {
	var amount;
	if ($("#passTypeInput").val() === "vip") {
		amount = numPasses * 800;
	} else {
		amount = numPasses * 500;
	}

	$("#fields input").attr("readonly", "true");
	$("#numPassesSelect").attr("readonly", "true");
	
	$("#fields").append('<div class="form-group"><label for="amount">Amount</label><input name="amount" class="form-control" id="finalAmount" readonly /></div>');
	$("#finalAmount").val(amount);
}

function generateFields(numPasses) {
	for (var i = 1; i <= numPasses; i++) {
		var fr = '<h5>Pass ' + i + '</h5>' + 
			'<div class="row">' +
			'<div class="col-md-6">' +
			'<input class="form-control" placeholder="First Name" type="text" name="firstName-' + i + '"/>' +
			'</div>' +
			'<div class=" col-md-6">' +
			'<input class="form-control" placeholder="Last Name" type="text" name="lastName-' + i + '"/>' + 
			'</div>' +
			'</div>';
		var form = $(fr);
		$('#fields').append(form);
	}
}