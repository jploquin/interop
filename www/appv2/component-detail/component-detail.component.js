'use strict';


// Register `componentDetail` component, along with its associated controller and template
angular.
  module('componentDetail',['ngMaterial']).
  component('componentDetail', {
    templateUrl: 'component-detail/component-detail.template.html',
    //template: 'TBD: Detail view for <span>{{$ctrl.productId}}</span>',
    controller: ['$routeParams','$http','$rootScope','$scope','$window','$mdDialog',
      function componentDetailController($routeParams,$http,$rootScope, $scope,$window,$mdDialog) {
        this.componentId = $routeParams.componentId;
	      var self = this;
	      $scope.loading=0;
        $scope.loading++;

  $rootScope.globalLoading++;
	//get details
 

   var myToken="";
   var username="";
   if ($window.sessionStorage['myLogin']!=null){
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
        myToken=myObj.token;
        username=myObj.username;
   }
 
  	$http.get('/node/product?productId='+this.componentId+'&token='+
			myToken+'&username='+username).
            success(function(data) {
            self.component = data;
            if (self.component.description!=null) self.component.description=self.component.description.trim();
            $rootScope.globalLoading--;
//	    $scope.loading --;
          }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          myWarning($mdDialog,data);//JSON.stringify({data: data}));
              });

 // update category
  $scope.updateComponent= function(){
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
       	var dataObj = {
          product_id: self.componentId,
          name: self.component.name,
  				description : self.component.description,
          product_access : self.component.product_access,
          product_access_url : self.component.product_access_url,
          username: myObj.username,
          token: myObj.token
    		};	
        $rootScope.globalLoading++;
       //$scope.loading++;  
       $http({
              url: '/node/updateProduct',
              method: "PUT",
              data: dataObj,
              headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
              $rootScope.globalLoading--;
              //reask component list
                    $rootScope.globalLoading++;
                    $http.get('/node/listproducts?product_type=1&token='+
                                      $window.localStorage['jwt']).
                          success(function(data) {
                         // self.components = data;
                          $rootScope.components = data;
                          $rootScope.globalLoading--;
                        })
                        .error(function (data, status, headers, config) {
                          $rootScope.globalLoading--;
                        });

              
              }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          myWarning($mdDialog,data);
              });  
     }
    };      


      }
    ]
  });
