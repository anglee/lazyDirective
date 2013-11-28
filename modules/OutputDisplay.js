(function (angular) {
    "use strict";
    var MAX_CAPACITY = 100;
    var module = angular.module("M_OutputDisplay", []);
    module.factory("outputDisplayFactory", function ($rootScope) {
        var displays = {
            default: {
                template: "<H1>Default</H1>"
            },
            aaa: {
                template: "<H1>AAA</H1>"
            },
            bbb: {
                template: "<H1>BBB</H1>"
            }
        };
        var names = ["aaa", "bbb"];
        var refreshRootScope = function () {
            $rootScope.$$phase || $rootScope.$apply();
        };
        function _set (index, name, impl) { // only support 'A' directives
            names[index] = name;
            if (typeof impl === "function") {
                impl = impl();
            }
            displays[name] = impl;
            _refresh(name);
        };
        function _refresh (what) {
            if (!what) {
                what = "all";
            }
            $rootScope.$broadcast("outputDisplayFactoryUpdated", what);
            refreshRootScope();
        };

        return {
            getOutputDisplay: function (name) {
                return (name && displays[name]) ? displays[name] : displays.default;
            },
            get: function (index) {
                var name = names[index];
                return this.getOutputDisplay(name);
            },
            add: function (name, impl) {
                var index = names.indexOf(name);
                if (index !== -1) {
                    names[index] = "default"
                }
                index = names.length;
                if (index >= MAX_CAPACITY) {
                    throw "Cannot add output: '"+ name + "', capacity(" + MAX_CAPACITY + ") reached";
                }
                _set(index, name, impl);
            },
            getIndex: function (name) {
                var index = names.indexOf(name);
                if (index === -1) {
                    return "-default";
                } else {
                    return index;
                }
            },
            refresh: _refresh
        };
    });

    module.directive("outputDefault", function (outputDisplayFactory) {
        return outputDisplayFactory.getOutputDisplay("default");
    });
    for (var i = 0; i < MAX_CAPACITY; ++i) {
        (function () {
            var ii = i;
            module.directive("output" + ii, function (outputDisplayFactory) {
                //console.log("directive output" + ii);
                return outputDisplayFactory.get(ii);
            });
        })();
    }
    module.directive("outputDisplay", function ($compile, outputDisplayFactory) {
        return {
            restrict: "E",
            template: "<div>OUTPUT</div>",
            scope: {
                type: "@",
                model: "="
            },
            link: function (scope, element, attrs) {
                var refresh = function (outputIndex) {
                    element.html("<div output" + outputIndex + " model='model'></div>");
                    $compile(element.contents())(scope);
                };
                scope.$watch("type", function (newValue) {
                    refresh(outputDisplayFactory.getIndex(newValue));
                });
                scope.$on("outputDisplayFactoryUpdated", function (ev, what) {
                    if (what === "all" || what === scope.type) {
                        refresh(outputDisplayFactory.getIndex(scope.type));
                    }
                });
            }
        };
    });
})(angular);