$(document).ready(function () {

	$("#fields").submit(function (e) { 
		e.preventDefault();
		if (validated()) {
	
			var fields = $("#fields input");
			var formData = {};
	
			for (var i = 0; i < fields.length; i++) {
				formData[fields[i].name] = fields[i].value;
			}
			formData['abstract'] = $("#abstractInput").val();
	
			console.log(formData);
			var splits = $(location).attr('href').split('/');
			var event = splits[splits.length - 1];
			
			$.post("/registrations/" + event + "/register", formData,
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
		}
	});
});


function validated() {
	
	for (var field in $("#required input")) {
		if (field.length == 0) {
			$(field).addClass("is-invalid");
			return false;
		} else {
			$(field).removeClass('is-invalid');
		}
	}

	var university = $("#university");
	if (university.length == 0) {
		university.addClass('is-invalid');
		return false;
	} else {
		university.removeClass('is-invalid');
	}

	var phoneLength = $("#phoneInput").val().length;
	var emailProvider = $("#emailInput").val().split("@");
	console.log(phoneLength);
	console.log(emailProvider);
	if (phoneLength !== 10) {
		$("#phoneInput").addClass('is-invalid');
		return false;
	}
	if (emailProvider.length == 0) {
		$("#emailInput").addClass('is-invalid');
		return false;
	}

	if ($("#teamNameInput").val() == 0) {
		$("#teamNameInput").addClass("is-invalid");
		return false;
	} else {
		$("#teamNameInput").removeClass('is-invalid');
	}

	if ($("#contactNameInput").val() == 0) {
		$("#contactNameInput").addClass("is-invalid");
		return false;
	} else {
		$("#contactNameInput").removeClass('is-invalid');
	}

	if ($("#projectTitleInput") != 0) {
		// exists
		if ($("#projectTitleInput").val() == 0) {
			// length is 0
			$("#projectTitleInput").addClass('is-invalid');
			return false;
		} else {
			$("#projectTitleInput").removeClass('is-invalid');
		}
	}

	if ($("#abstractInput") != 0) {
		// exists
		if ($("#abstractInput").val() == 0) {
			// length is 0
			$("#abstractInput").addClass('is-invalid');
			return false;
		} else {
			$("#abstractInput").removeClass('is-invalid');
		}
	}

	return true;
}