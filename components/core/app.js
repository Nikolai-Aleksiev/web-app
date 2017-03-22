'use strict';

var app = app || {};

$(document).ready(function () {

	app.data = new Everlive({
		appId: 'q01nsx8d9t5rb3vh',
		scheme: 'https',
	});

	$("#main-menu").kendoMenu({
		select: app.menuNavigate
	});
	$(".account-menu").kendoMenu({
		select: app.menuNavigate
	});

	app.successNotification = $("#notification").kendoNotification({
		position: {
			pinned: true,
			top: 30,
			left: 30
		},
		autoHideAfter: 2000,
		templates: [{
			type: "update-success",
			template: $("#successTemplate").html()
		}]

	}).data('kendoNotification');


	app.router.start();
	app.navigate("Login");
});

app.menuNavigate = function (e) {
	var item = $(e.item).children(".k-link").text();

	//var dataItem = getItemByhref(item);

	//$("#myGrid").data('kendoGrid').dataSource.data();


	app.navigate(item);
}