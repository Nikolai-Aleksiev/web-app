var app = app || {};

(function () {

    app.dsProfileController = function (viewModel) {

        //   var getUser = app.data.Users.currentUser();
        //   var updateUser = app.data.Users.updateSingle();

        app.dataSource = new kendo.data.DataSource({
            type: 'everlive',
            transport: {
                typeName: 'Users',
                dataProvider: app.data
            },
            filter: { field: "Id", operator: "eq", value: app.user.principal_id },
            serverFiltering: true,
            change: function (e) {
                debugger;

                viewModel.set('user', this.data()[0]);

                viewModel.set("genders", ["Male", "Female"]);
                viewModel.set("maritalStatuses", ["Single", "Married", "Widowed"]);
                viewModel.set("onSelect", selectFile);
                viewModel.set("updateProfile", updateProfile);

                viewModel.set("selectLabels", selectLabels);


                viewModel.set("displayNameText", "Display Name: ");
            },
            schema: {
                model: {
                    id: 'Id',
                    fields: { 
                   //     text: { type: "string" }
                }

                }
            },
            error: function (e) {

                if (e.xhr) {
                    var errorText = "";
                    try {
                        errorText = JSON.stringify(e.xhr);
                    } catch (jsonErr) {
                        errorText = e.xhr.responseText || e.xhr.statusText || 'An error has occurred!';
                    }
                    alert(errorText);
                }
            },
        });

        app.dataSource.read();

    }


    function selectLabels(e) {
        // TODO: logic should be put here

    }

    function updateProfile(e) {

        app.dataSource.sync();


        app.successNotification.show({
            message: "Profile Updated Successfully"
        }, "update-success");

    }

    function selectFile(e) {
        var message = $.map(e.files, function (file) { return file.name; }).join(", ");
        alert("event :: select (" + message + ")");
    }

})();

