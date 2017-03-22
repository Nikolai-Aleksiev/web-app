var app = app || {};


app.logoutController = function () {


    $("#main-menu").hide();
    $("#login-menu").show();
    $("#profile-menu").hide();

    app.navigate('Login');

    app.user = null;

}
