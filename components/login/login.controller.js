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

  // to see different menu options and roles try with these two users
  // user: user, password: U12345. This user will be logged in by default if nothing is being filled as you can see few lines below
  // user: seth, password: 12345


  $("#login-menu").hide();
  $("#profile-menu").show();

  var userName = $(".user-name").val();
  var userPassword = $(".user-password").val();

  if (userName == "") {
    userName = 'user';
  }

  if (userPassword == "") {
    userPassword = 'U12345';
  }

  app.data.authentication.login(userName, userPassword,
    function success(data) {

      app.user = data.result;

      app.routes = {};
      app.addDafaultRoutes();

      loadMenu();

      app.navigate('Grid');

    }, function error(error, result) {

    });

}

function loadMenu() {
  $.getJSON('resources/data/menu.json', function (menus) {

    // var userMenu = menus;

    // In normal situations the back end will return only one menu 
    // depending on the user
    // here we just simulate back end loading the menus from the JSON file and 
    // getting the corresponding to the specific user menu
    var userMenu = getUserMenu(menus);



    $("#main-menu").kendoMenu({
      dataSource: userMenu,
      select: function (e) {
        app.navigate($(e.item).children(".k-link").text());
      }
    }).show();


    // Add route options for all menu items

    var navObject = {};

    addRoutes(userMenu, navObject);

    if (navObject.text) {
      app.navigate(navObject.text);
    }

  });
}

function getUserMenu(menus) {

  for (var i = 0; i < menus.length; i++) {

    if (menus[i].userId == app.user.principal_id) {
      return menus[i].menu;
    }
  }
}

function addRoutes(items, navObject) {

  items.forEach(function (item) {

    if (item.uri) {
      app.addRoute(item.text, item);

      if (item.default) {
        navObject.text = item.text;
      }
    }

    if (item.items) {
      addRoutes(item.items);
    }
  });

}
