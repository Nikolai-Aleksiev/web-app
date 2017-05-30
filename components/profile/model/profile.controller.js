var app = app || {};

(function () {

    app.profileController = function (viewModel) {

        var $ctrl = viewModel;

        app.data.Users.currentUser(
            function (data) {

                if (data.result == null) {
                    app.navigate('Login');
                }
                else {
                    var user = data.result;

                    //$ctrl.set("$ctrl", user);

                    $ctrl.set("displayName", user.DisplayName);
                    $ctrl.set("email", user.Email);
                    $ctrl.set("gender", user.Gender);
                    $ctrl.set("birthDay", user.BirthDay);
                    $ctrl.set("maritalStatus", user.MaritalStatus);
                    $ctrl.set("address1", user.Address1);
                    $ctrl.set("address2", user.Address2);
                    $ctrl.set("genders", ["Male", "Female"]);
                    $ctrl.set("maritalStatuses", ["Single", "Married", "Widowed"]);
                    $ctrl.set("onSelect", selectFile);
                    $ctrl.set("updateProfile", updateProfile);

                    $ctrl.set("selectLabels", selectLabels);


                    $ctrl.set("displayNameText", "Display Name: ");
                }
            },
            function (err) {
                alert(err.message + " Please log in.");
            });


        function selectLabels(e) {
            // TODO: logic should be put here
        }

        function updateProfile(e) {

            var updateObject = {
                "Id": app.user.principal_id,
                "DisplayName": $ctrl.get('displayName'),
                "BirthDay": $ctrl.get('birthDay'),
                "Email": $ctrl.get('email'),
                "Gender": $ctrl.get('gender'),
                "MaritalStatus": $ctrl.get('maritalStatus'),
                "Address1": $ctrl.get("address1"),
                "Address2": $ctrl.get("address2")
            };

            debugger;

            app.data.Users.updateSingle(updateObject,
                function (data) {
                    alert(JSON.stringify(data));
                    app.successNotification.show({
                        message: "Profile Updated Successfully"
                    }, "update-success");
                },
                function (error) {
                    alert(JSON.stringify(error));
                });
        }

        function selectFile(e) {
            var message = $.map(e.files, function (file) { return file.name; }).join(", ");
            alert("event :: select (" + message + ")");
        }
    }
})();

