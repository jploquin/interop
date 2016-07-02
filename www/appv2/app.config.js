'use strict';

angular.
  module('interopApp').
  config(['$locationProvider' ,'$routeProvider','$httpProvider',
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
//        $rootScope.testClient = false;
//	 $rootScope.token=0;
   $rootScope.globalLoading=0;
//   
//   $rootScope.connected=0;
   
	//$window.localStorage['jwt']="myToken"; 
    });
;
