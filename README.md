lazyDirective
=============

Me playing with the idea of defining a directive dynamically.

try these steps in browser console:
```
getOs()[0] = {type: "eee"}; refreshRootScope();
```
```
lazyload.outputDisplayFactory.add('eee', function () {
  return {
    template: "<h1>Hello, {{ name }}</h1>",
    controller: function ($scope) {
      $scope.name = "Angular";
    }
  };
});
```
```
getOs()[1] = {type: "eee"}; refreshRootScope();
```
