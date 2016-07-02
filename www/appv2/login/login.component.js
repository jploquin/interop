'use strict';
/* 
	login page, return of sso cauthentication.

*/

 
angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    controller: ['$routeParams','$http','$rootScope','$scope','$window',
      function loginController($routeParams,$http,$rootScope, $scope,$window) {
        this.caseId = $routeParams.caseId;
	  var self = this;
 //  $scope.loading=0;
   
//   $scope.loading++;
$rootScope.globalLoading++;
 	//get sso login info + token
  	$http.get('/nodeTest/getSSOLoginInfo?sso='+$routeParams.sso+'&sig='+$routeParams.sig).
            success(function(data) {
            $rootScope.globalLoading--;
//            $scope.loading--;
            $window.sessionStorage['myLogin']=data;
            $rootScope.myLogin = data;
            $rootScope.connected=1;
                        
            }).error(function (data, status, headers, config) {
                $rootScope.globalLoading--;
//                $scope.loading--;
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  


      }
    ]
  });
