(function (angular) {
    "use strict";
    var module = angular.module("M_CCC", []);

    module.factory("ccc", function () {
        return {
            template: "<h1>CCC - {{foo}}</h1>",
            controller: function($scope) {
                $scope.foo = "BAR";
            }
        };
    });

})(angular);