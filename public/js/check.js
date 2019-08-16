$(document).ready(function () {
	$("#checkForm").submit(function (e) {
		e.preventDefault();

		$.post("/check/check", { email: $("#email").val(), event: $("#event").val() },
			function (data, textStatus, jqXHR) {
				console.log(data);
				if (data) {
					$("#response").text("Exists");
				} else {
					$("#response").text("Doesn't exist");
				}
			},
			"json"
		);
	});
});