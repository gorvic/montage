var Montage = require("montage").Montage;
var Map = require("montage/collections/map").Map;

exports.Router = Montage.specialize({

  routes: { value: [] },

  parts: { value: null },

  path: { value: null },

  default: { value: null },

  constructor: {
    value: function() {
      var _this = this;
      //https://developer.mozilla.org/en/docs/Web/Events/popstate
      window.onpopstate = function(e) {
        _this.updatePath(); //выстреливает, когда, например, вводится вручную строка адреса или history.back()
      };
    }
  },

  updatePath: {
    value: function(path) {
      //путь приходит в первый раз как undefined
      //в последующие разы, например, как identity/login и в this.path кладётся либо "", либо #!/+path
      //если указывается не корень и идёт первый запуск, то получаем данные из window.location.hash
      this.path = path && ("#!/" + path) || window.location.hash.slice(1);

      //заносим в историю, если есть что
      if (path)
        history.pushState(this.path, this.path, this.path);

       //заполняем части пути. Parts = Map()
        this.parts = this.compare(this.path);
    }
  },

  compare: {
    value: function(target) {

      //default - по умолчанию "home"
      //в случае, например, пустого таргета получаем ["home"] - массив!
      //в случае какого-то пути - получаем его без хэша -т.е. !#/identity/login => identity/login и
      //делим и получаем массив ['identity', 'login']
      var items = (target.replace(/^#?!\//, "") || this["default"]).split("/");

      //идём по набору роутов, изначально заданному в html-шаблоне через properties
      for (var i = 0; i < this.routes.length; i++) {

        var path = this.routes[i];

        //получаем отдельный роут и делим его на подпути, отдельные части роута между /
        //"root:identity/action:(login|signup)".split("/") => ["root:identity", "action:(login|signup)"]
        var route = path.split("/");

        //если число частей роута больше-равно, чем число частей исходного пути, то идём  дальше
        if (route.length >= items.length) {
          //массив совпадений
          matches = [];

          //для каждой части роута
          for (var iter = 0; iter < route.length; iter++) {

            var item = items[iter] || ""; //если номер части роута уже больше количества частей пути - то пустая строка
            var el = route[iter].split(":"); //получаем массив параметров для части роута, например root:identity => ['root', 'identity']
            var test = RegExp("^" + el[1] + "$").test(item); //тестируем параметр части роута на полное совпадение с частью пути

            matches.push([el[0], test ? item : false]); //если совпало - кладём в совпадения, иначе false
          }


          //"<-": "@router.parts.get('root')" - получаем соответствие, если совпадает для каждого элемента - то возвращаем
          //root -> auth
          //action -> signup
          if (matches.every(function(x) { return x[1] !== false; }))
            return Map(matches);
        }
      }

      return Map();
    }
  }
});
