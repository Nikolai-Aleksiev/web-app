var app = app || {};

(function () {

    app.router = new kendo.Router({
        routeMissing: function (e) {
            console.log("non existing route: " + e.url);
            app.navigate('Login');
        },
        change: function (e) {


            // here custom authentication or authorization logic can be added
            if (e.url != 'login' && e.url != 'register' && !app.userMatch) {
                e.preventDefault();

                app.data.Users.currentUser(function (data) {

                    if (data.result == null) {
                        app.router.navigate('login');

                    }
                    else
                        if (data.result.Id == app.user.principal_id) {
                            app.userMatch = true;
                            app.router.navigate(e.url);
                        }
                        else {
                            alert("User does not match.");

                        }
                }, function (err) {
                    alert(err.message + " Please log in.");
                });

            }

            app.userMatch = false;

        }
    });

    app.addRoute = function (state, routeOptions) {

        // In order to be able to map custom states to routes that want to be shown
        // all routes will be mapped in app.routes collection
        // So if routes colleciton already exist ok otherwise here new colleciton will be initiated
        app.routes = app.routes || {};

        // Actual mapping happens here
        app.routes[state] = routeOptions.url;

        // Route to Telerik router object is being created
        app.router.route(routeOptions.url, function () {

            // Telerik MVVM model is created, later it will be passed to the view and the controller
            routeOptions.viewModel = kendo.observable({});

            app.viewLoaderService.loadView(routeOptions)
                .then(function () {

                    if (routeOptions.url == 'products') {

                        server.service.getRoles(routeOptions.url)
                            .then(function (response) {

                                routeOptions.viewModel.set("roles", response.roles);

                                var controllerStart = app[routeOptions.controller];

                                controllerStart(routeOptions.viewModel);

                            });
                    }
                    else {

                        var controllerStart = app[routeOptions.controller];

                        controllerStart(routeOptions.viewModel);

                    }

                });
        });
    };

    app.navigate = function (route) {

        var url = app.routes[route];

        app.router.navigate(url);
    };

    app.addRoute('Login', {
        url: 'login',
        templateUrl: '/components/login/login.view.html',
        templateId: 'login-page-template',
        controller: 'loginController',
    });
    app.addRoute('Register', {
        url: 'register',
        templateUrl: '/components/register/register.view.html',
        templateId: 'register-page-template',
        controller: 'registerController',
    });
    app.addRoute('Profile', {
        url: 'profile',
        templateUrl: '/components/profile/model/profile.view.html',
        templateId: 'profile-page-template',
        controller: 'profileController',
    });

    app.addRoute('DS Profile', {
        url: 'dsprofile',
        templateUrl: '/components/profile/dataSource/dsProfile.view.html',
        templateId: 'ds-profile-page-template',
        controller: 'dsProfileController',
    });

        app.addRoute('Grid', {
        url: 'grid',
        templateUrl: '/components/grid/grid.view.html',
        templateId: 'grid-page-template',
        controller: 'gridController',
    });




    app.addRoute('Logout', {
        url: 'logout',
        templateUrl: '/components/logout/logout.view.html',
        templateId: 'logout-page-template',
        controller: 'logoutController',
    });
    app.addRoute('Chart Filtering', {
        url: 'chart/filter',
        templateUrl: '/components/charts/filter/filter.view.html',
        templateId: 'filter-page-template',
        controller: 'filterController',
    });
    app.addRoute('Blog', {
        url: 'blog',
        templateUrl: '/components/blog/blog.view.html',
        templateId: 'blog-page-template',
        controller: 'blogController',
    });
    app.addRoute('Stacked Chart', {
        url: 'chart/stacked',
        templateUrl: '/components/charts/stacked/stacked.view.html',
        templateId: 'stacked-page-template',
        controller: 'stackedController',
    });
    app.addRoute('Chart Interaction', {
        url: 'chart/interaction',
        templateUrl: '/components/charts/interaction/interaction.view.html',
        templateId: 'interaction-page-template',
        controller: 'interactionController',
    });
    app.addRoute('Advanced Filtering', {
        url: 'chart/advanced-filtering',
        templateUrl: '/components/charts/advanced/advanced.view.html',
        templateId: 'advanced-page-template',
        controller: 'advancedController',
    });
    app.addRoute('Dashboard', {
        url: 'dashboard',
        templateUrl: '/components/dashboard/dashboard.view.html',
        templateId: 'dashboard-page-template',
        controller: 'dashboardController',
    });

})();




