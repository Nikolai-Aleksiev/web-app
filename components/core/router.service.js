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
        app.routes[state] = routeOptions.uri;

        // Route to Telerik router object is being created
        app.router.route(routeOptions.uri, function () {

            // Telerik MVVM model is created, later it will be passed to the view and the controller
            routeOptions.viewModel = kendo.observable({});

            // If one would like to prefix the model properties in the view similar to 
            // Angular way, one could pass here the instance and it will be bound to and passed later to the controller 
            if (routeOptions.controllerAs) {

                // Initialize the 'controllerAs' as empty object
                routeOptions.viewModel.set(routeOptions.controllerAs, {});

                // Attach it to the view options object
                routeOptions.$ctrl = routeOptions.viewModel.get(routeOptions.controllerAs);

                // here the passed user roles will be attached to the view model and later be accesible in the controller
                // If 'controllerAs' is specified the subproperty will be passed
                // Therefore the roles will be attached to this property
                routeOptions.$ctrl.set("roles", routeOptions.roles);
            }
            else {

                // If 'controllerAs' is not specified the roles will be attached 
                // directly to the view model object
                routeOptions.viewModel.set("roles", routeOptions.roles);
            }

            app.viewLoaderService.loadView(routeOptions)
                .then(function () {

                    var controllerStart = app[routeOptions.controller];

                    if (routeOptions.$ctrl) {
                        controllerStart(routeOptions.$ctrl);
                    }
                    else {
                        controllerStart(routeOptions.viewModel);
                    }

                });
        });
    };

    app.navigate = function (route) {

        var uri = app.routes[route];

        app.router.navigate(uri);
    };

    app.addDafaultRoutes = function () {
        app.addRoute('Login', {
            uri: 'login',
            templateUri: '/components/login/login.view.html',
            templateId: 'login-page-template',
            controller: 'loginController',
        });
        app.addRoute('Register', {
            uri: 'register',
            templateUri: '/components/register/register.view.html',
            templateId: 'register-page-template',
            controller: 'registerController',
        });
        app.addRoute('Profile', {
            uri: 'profile',
            templateUri: '/components/profile/model/profile.view.html',
            templateId: 'profile-page-template',
            controller: 'profileController',
            controllerAs: '$ctrl'
        });
        app.addRoute('DS Profile', {
            uri: 'dsprofile',
            templateUri: '/components/profile/dataSource/dsProfile.view.html',
            templateId: 'ds-profile-page-template',
            controller: 'dsProfileController',
        });
        app.addRoute('Logout', {
            uri: 'logout',
            templateUri: '/components/logout/logout.view.html',
            templateId: 'logout-page-template',
            controller: 'logoutController',
        });
    };

    app.addDafaultRoutes();


})();




