"use strict";
(function (angular) {
    var myApp = angular.module("myApp", ['M_OutputDisplay', 'M_CCC']);
    myApp.controller("myCtrl", function ($scope, $rootScope, $injector) {
        $scope.name = "AngularJS";
        $scope.forceRefresh = 0;
        $scope.outputs = [
            { type: "aaa"},
            { type: "bbb"},
            { type: "ccc"},
            { type: "ddd"},
            { type: "eee"}
        ];
        window.refreshRootScope = function () {
            $rootScope.$$phase || $rootScope.$apply();
        };
        window.getOs = function () {
            return $scope.outputs;
        }
        $scope.a = {value: "bbb"};

        window.injector = $injector;
    });
    myApp.run(function (outputDisplayFactory, ccc) {
        outputDisplayFactory.add("ccc", ccc);
        outputDisplayFactory.add("ddd", function () {
            return {
                template: "<h1>DDD - {{foo}}</h1>",
                controller: function($scope, $timeout) {
                    $scope.foo = "BAR";
                    $timeout(function () {
                        $scope.foo = "XYZ";
                    }, 1000);
                }
            };
        });
        outputDisplayFactory.add("eee", {
            template: "<h1>EEE {{model.value}}</h1>",
            scope: {
                model: "="
            },
            controller: function($scope) {
                //console.log($scope.model);
            }
        });
        window.lazyload = { outputDisplayFactory: outputDisplayFactory };
    });
})(angular);