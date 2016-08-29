'use strict';

angular.
  module('interopApp')
  .directive('focusOnShowww', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    if(newValue){
                        $timeout(function(){
                            $element[0].focus();
                        }, 50);
                    }
                })      
            }
            if ($attr.ngHide){
                $scope.$watch($attr.ngHide, function(newValue){
                    if(!newValue){
                        $timeout(function(){
                            $element[0].focus();
                        }, 50);
                    }
                })      
            }

        }
    };
})
  .directive('focusMes', function($timeout, $rootScope) {
  return {
    restrict: 'A',
    scope: {
      focusValue: "=focusMe"
    },
    link: function($scope, $element, attrs) {
      $scope.$watch("focusValue", function(currentValue, previousValue) {
        if (currentValue === true && !previousValue) {
          $element[0].focus();
        } else if (currentValue === false && previousValue) {
          $element[0].blur();
        }
      })
    }
  }
  })
  .directive('focusMe', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          },50);
        }
      });
      // on blur event:
      /*element.bind('blur', function() {
         scope.$apply(model.assign(scope, false));
      });*/
    }
  };
})
  
  
  .config(['$locationProvider' ,'$routeProvider','$httpProvider',
    function config($locationProvider, $routeProvider,$httpProvider) {
      $locationProvider.hashPrefix('!');

  $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
//    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';



      $routeProvider.
        when('/products', {
          template: '<product-list></product-list>'
        }).
        when('/themes', {
          template: '<theme-list></theme-list>'
        }).
 /*       when('/products/:productId', {
          template: '<product-detail></product-detail>'
        }).
 */
        when('/themes/:themeId', {
          template: '<theme-detail></theme-detail>'
        }).
        when('/products/:productId', {
          template: '<product-detail></product-detail>'
        }).
        when('/components/:componentId', {
          template: '<component-detail></component-detail>'
        }).
        when('/case/:caseId', {
          template: '<case-detail></case-detail>'
        }).
        when('/newTheme', {
          template: '<theme-new></theme-new>'
        }).
        when('/testNew/:categoryId', {
          template: '<test-new></test-new>'
        }).
        when('/dashboard', {
          template: '<dashboard></dashboard>'
        }).
        when('/login', {
          template: '<login></login>'
        }).
        when('/headsite', {
          template: '<headsite></headsite>'
        }).
        otherwise('/dashboard');
    }
  ])
  .run(function ($rootScope,$window) {
    if ($window.sessionStorage['myLogin']==null){
      $rootScope.connected=0;
      $rootScope.myLogin=null;
     } 
     else {
      $rootScope.connected=1;
      $rootScope.myLogin=JSON.parse($window.sessionStorage['myLogin']);
     }
//        $rootScope.testClient = false;
//	 $rootScope.token=0;
   $rootScope.globalLoading=0;
   $rootScope.products={};
   if ($rootScope.currentTestCaseList==null) $rootScope.currentTestCaseList={};
   if ($rootScope.currentTestCaseNavItem==null) $rootScope.currentTestCaseNavItem = 'page1';
//   
//   $rootScope.connected=0;
   
	//$window.localStorage['jwt']="myToken"; 
    });
;
