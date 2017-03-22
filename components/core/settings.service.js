var app = app || {};

app.settings = {
    get: function (view) {
        return {
            viewPath: "/components/" + view + "/" + view + ".view.html",
            viewContainer: "#container",
            templateId: view + "-page-template",
            templateContainer: "#templates-container",
        };
    }
}

