var app = app || {};


app.loginController = function () {

  $(".login-control").bind("keypress", function (e) {
    if (e.which == 13) {
      login();
    }
  });


  $("#login-button").kendoButton({
    click: login
  });


}

function login() {

  

  $("#main-menu").show();
  $("#login-menu").hide();
  $("#profile-menu").show();



  app.data.authentication.login('user', 'U12345',
    function success(data) {

      app.user = data.result;

      app.navigate('Grid');

    }, function error(error, result) {

    });


}
