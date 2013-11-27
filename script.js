"use strict";
(function (angular) {
    var myApp = angular.module("myApp", []);
    myApp.controller("myCtrl", function ($scope, $rootScope, $injector) {
        $scope.name = "AngularJS";
        $scope.forceRefresh = 0;
        $scope.as = [
            { value: "aaa"},
            { value: "bbb"},
            { value: "ccc"},
            { value: "ddd"}
        ];
        window.refreshRootScope = function () {
            $scope.forceRefresh++;
            $rootScope.$$phase || $rootScope.$apply();
        };
        window.getAs = function () {
            return $scope.as;
        }
        $scope.a = {value: "bbb"};
        window.injector = $injector;

    });

    myApp.factory("outputDisplayFactory", function () {
        var od = {
            aaa: {
                restrict: 'E',
                template: "<H1>AAA</H1>"
            },
            bbb: {
                restrict: 'E',
                template: "<H1>BBB</H1>"
            },
            ccc: {
                restrict: 'E',
                template: "<H1>CCC</H1>"
            },
            default: {
                restrict: 'E',
                template: "<H1>Default</H1>"
            }
        };
        var map = {
            output0: "aaa",
            output1: "bbb",
            output2: "ccc"
        };
        var map2 = {
            aaa: "output0",
            bbb: "output1",
            ccc: "output2"
        };
        window.od = od;
        return {
            getOutputDisplay: function (name) {
                return (name && od[name]) ? od[name] : od.default;
            },
            get: function (id) {
                var name = map[id];
                return this.getOutputDisplay(name);
            },
            set: function (id, name, obj) {
                map[id] = name;
                map2[name] = id;
                od[name] = obj;
            },
            getID: function (name) {
                return map2[name] ? map2[name] : "output-default";
            }
        };
    });

    myApp.directive("outputDefault", function (outputDisplayFactory) {
        return outputDisplayFactory.getOutputDisplay("default");
    });
    for (var i = 0; i < 100; ++i) {
        (function () {
            var directiveName = "output" + i;
            myApp.directive(directiveName, function (outputDisplayFactory) {
                return outputDisplayFactory.get(directiveName);
            });
        })();
    }

    myApp.directive("outputDisplay", function ($compile, outputDisplayFactory) {
        return {
            restrict: "E",
            template: "<div>OUTPUT</div>",
            link: function (scope, element, attrs) {
                console.log("link outputDisplay, a =", scope.a.value);
                scope.$watch("a.value", function (newValue) {
                    var id = outputDisplayFactory.getID(newValue);
                    console.log(newValue, id);
                    element.html("<" + id + "></" + id + ">");
                    $compile(element.contents())(scope);
                });
                scope.$watch("forceRefresh", function () {
                    var newValue = scope.a.value;
                    var id = outputDisplayFactory.getID(newValue);
                    console.log(newValue, id);
                    element.html("<" + id + "></" + id + ">");
                    $compile(element.contents())(scope);
                });
            }
        };
    });
})(angular);