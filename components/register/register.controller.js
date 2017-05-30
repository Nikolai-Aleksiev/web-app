'use strict';

var app = app || {};

(function () {

  app.registerController = function () {

    var registerValidator = new kendo.ui.Validator(".register", {
      rules: {
        passwordMatch: function (input) {
          if (input.is("#user-registration-repeat-password") && input.val() != "") {
            var password = $("#user-registration-password");

            return input.val() == password.val();
          }

          return true;
        },
        inputIsValid: function (input) {
          if (input.is("#user-registration-name") && input.val() != "") {

            // call validation function

            return true;
          }

          return true;
        }
      },
      messages: {
        passwordMatch: "Password should match.",
        inputIsValid: "Invalid value."
      }
    });

    $("#register-button").kendoButton({
      click: function (e) {

        if (registerValidator.validate()) {

          var email = $("#user-registration-name").val();
          var password = $("#user-registration-password").val();
          var attrs = {
            Email: email,
            DisplayName: email
          };

          app.data.Users.register(email, password, attrs,
            function success(data) {
              alert("Success: " + data);
            }, function error(error) {
              debugger;
              alert("Error: " + error);
            });
        }
      }
    });
  }

  function checkInput(params) {

    app.data.invokeCloudFunction('checkInput', params).then(function (data) {
      alert(JSON.stringify(data));
    }, function (err) {
      alert(JSON.stringify(err));
    });
  }

})();

