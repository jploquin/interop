'use strict';

// Register `themeDetail` component, along with its associated controller and template
angular.
  module('themeDetail').
  component('themeDetail', {
    templateUrl: 'theme-detail/theme-detail.template.html',
    //template: 'TBD: Detail view for <span>{{$ctrl.themeId}}</span>',
    controller: ['$routeParams','$http','$rootScope','$scope','$window',
      function ThemeDetailController($routeParams,$http,$rootScope, $scope,$window) {
        this.themeId = $routeParams.themeId;
	var self = this;
	$scope.loading=0;
// $rootScope.globalLoading=0;
      $rootScope.globalLoading++;
//        $scope.loading++;
	//get details
  	$http.get('/node/Category?categoryId='+this.themeId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.category = data;
      $rootScope.globalLoading--;
      
	//get list of test cases
  $rootScope.globalLoading++;
//	$scope.loading++;
  	$http.get('/node/listCases?categoryId='+self.themeId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.cas = data;
      $rootScope.globalLoading--;
      
//	    $scope.loading--;
          }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
 //  			          alert( "failure: " + data);//JSON.stringify({data: data}));
              }); 
      
      
//	    $scope.loading --;
          })
          .error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          alert( "failure: " + data);//JSON.stringify({data: data}));
              }); 

      

  // update category
  $scope.updateCategory= function(){
     if ($window.sessionStorage['myLogin']==null){
       alert("You must be connected");
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
       	var dataObj = {
          test_category_id: self.themeId,
          name: self.category.name,
  				description : self.category.description,
          username: myObj.username,
          token: myObj.token
    		};	
        $rootScope.globalLoading++;
  //     $scope.loading++;  
       $http({
              url: '/node/updateCategory',
              method: "PUT",
              data: dataObj,
              headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
              $rootScope.globalLoading--;
              }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          alert( "failure: " + JSON.stringify({data: data}));
              });  
    }
    };      

 // update category
  $scope.testLog= function(){
     	var dataObj = {
        login: "jerome.ploquin@modernisation.gouv.fr",
        password: "fanfaronfanfaron"
  		};	

     $http({
            url: 'https://forum.etalab.gouv.fr/session',
            method: "POST",
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            alert('ok!');      
            }).error(function (data, status, headers, config) {
 			          alert( "failure: " + status + '::' + JSON.stringify({data: data}));
            });  


    };      


    }  
      
    ]
  });
