var app = app || {};


app.blogController = function () {




    var dataSource = new kendo.data.DataSource({
        type: 'everlive',
        transport: {
            typeName: 'Activities',
            dataProvider: app.data
        },
        schema: {
            model: {
                fields: {
                    'Text': {
                        field: 'Text',
                        defaultValue: ''
                    },
                    'Picture': {
                        field: 'Picture',
                        defaultValue: ''
                    },
                }
            }
        },
        change: function (e) {
            debugger;
            var data = this.data();
            for (var i = 0; i < data.length; i++) {
              //  data[i].PictureUrl = '';
                //processImage(data[i]);

                /// start flattenLocation property
                /// end flattenLocation property
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

    processImage = function (item) {
        if (item.Picture != null) {
            var fileId = item.Picture;
            app.data.files.getDownloadUrlById(fileId)
                .then(function (downloadUrl) {
                    debugger;
                    item.PictureUrl = downloadUrl;
                },
                function (error) {
                    alert(JSON.stringify(error));
                });
        }
    },

    $("#activities-view").kendoListView({
        dataSource: dataSource,
        template: kendo.template($("#acitivities-view-template").html()),
    });

    $("#activities-add").kendoEditor({
        tools: [
            "bold", "italic", "underline",
            {

                name: "custom",
                template: "<button class='k-button' id='addPost'>Add Post</button>",
            }
        ]
    });

    $("#addPost").kendoButton().bind('click', function (e) {
        alert("Post Added");
        var editor = $("#activities-add").data("kendoEditor");

        dataSource.add({ Text: editor.value() });
        dataSource.sync();
        debugger;
    });

}