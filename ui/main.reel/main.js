var Component = require("montage/ui/component").Component;
var jquery = require("jquery");

exports.Main = Component.specialize({

  user: { value: null },

  constructor: {
    value: function () {
      console.log(this.application.config.RESTAPI_HOST);
    }
  },

  updatePath: {
    value: function(path) {
      //идём в роутер, т.е. по сути используем отдельный объект-хелпер

      //The templateObjects property of the
      //component is also used: it is a dictionary - like object that
      //contains references to all the objects that are declared in the
      //template

      this.templateObjects.router.updatePath(path);
    }
  },

  //авторизация при заходе
  //login: {
  //  value: function(action, email, password) {
  //    var data = {
  //      email: email,
  //      password: password
  //    };
  //
  //    var _this = this;
  //    io.socket.post("/user/" + action, data, function(resp) {
  //      if (resp.err)
  //        _this.templateObjects.identity.error = resp.err;
  //
  //      _this.updatePath("home");
  //      _this.user = resp;
  //    });
  //  }
  //},

  //Add a templateDidLoad method.This method executes
  //automatically when the framework has finished
  //loading the component, so it’s the ideal place
  //to populate the list with data.

  templateDidLoad: {
    value: function() {
      var _this = this;

      //если есть токен, то здесь получаем email для хедера
    //  io.socket.get("/user/whoami", function(resp) {  //users/me см. книгу
    //    _this.user = 'User';//resp.user;
    // });

      //обновляем пути при загрузке компонента,
      //изначально путь пуст, вне зависимости от того, какая ссылка была указана в адр. строке
      this.updatePath();
    }
  },

  //handleIdentityLogin: {
  //  value: function(ev) {
  //    this.login("login", ev.target.email, ev.target.password);
  //  }
  //},

  //handleIdentitySignup: {
  //  value: function(ev) {
  //    this.login("register", ev.target.email, ev.target.password);
  //  }
  //},

  handleButtonSignupAction: {
    value: function() {
      this.updatePath("auth/signup");
    }
  },

  handleButtonLoginAction: {
    value: function() {
      this.updatePath("auth/login");
    }
  },

  handleButtonLogoutAction: {
    value: function () {
      window.localStorage.removeItem('token');
      console.log('Remove token');
    }
  },

  handleButtonUsersAction: {
    value: function () {
      this.updatePath("users");
    }
  },
});
