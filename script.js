"use strict";
(function (angular) {
    var myApp = angular.module("myApp", []);
    myApp.controller("myCtrl", function ($scope) {
        $scope.name = "AngularJS";
    });

})(angular);