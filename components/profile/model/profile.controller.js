var app = app || {};

(function () {

    app.profileController = function (viewModel) {

        app.data.Users.currentUser(
            function (data) {

                if (data.result == null) {
                    app.navigate('Login');
                }
                else {
                    var user = data.result;

                    viewModel.set("displayName", user.DisplayName);
                    viewModel.set("email", user.Email);
                    viewModel.set("gender", user.Gender);
                    viewModel.set("birthDay", user.BirthDay);
                    viewModel.set("maritalStatus", user.MaritalStatus);
                    viewModel.set("address1", user.Address1);
                    viewModel.set("address2", user.Address2);
                    viewModel.set("genders", ["Male", "Female"]);
                    viewModel.set("maritalStatuses", ["Single", "Married", "Widowed"]);
                    viewModel.set("onSelect", selectFile);
                    viewModel.set("updateProfile", updateProfile);

                    viewModel.set("selectLabels", selectLabels);


                    viewModel.set("displayNameText", "Display Name: ");
                }
            },
            function (err) {
                alert(err.message + " Please log in.");
            });
    }


    function selectLabels(e) {
        // TODO: logic should be put here

    }

    function updateProfile(e) {

        var updateObject = {
            "Id": app.user.principal_id,
            "DisplayName": this.get('displayName'),
            "BirthDay": this.get('birthDay'),
            "Email": this.get('email'),
            "Gender": this.get('gender'),
            "MaritalStatus": this.get('maritalStatus'),
            "Address1": this.get("address1"),
            "Address2": this.get("address2")
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

})();

