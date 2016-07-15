'use strict';

// Register `productDetail` component, along with its associated controller and template
angular.
  module('productDetail',['ngMaterial']).
  component('productDetail', {
    templateUrl: 'product-detail/product-detail.template.html',
    //template: 'TBD: Detail view for <span>{{$ctrl.productId}}</span>',
    controller: ['$routeParams','$http','$rootScope','$scope','$window','$mdDialog',
      function productDetailController($routeParams,$http,$rootScope, $scope,$window,$mdDialog) {
        this.productId = $routeParams.productId;
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
 
  	$http.get('/node/Product?productId='+this.productId+'&token='+
			myToken+'&username='+username).
            success(function(data) {
            self.product = data;
            $rootScope.globalLoading--;
//	    $scope.loading --;
          }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          myWarning($mdDialog,data);//JSON.stringify({data: data}));
              });

 // update category
  $scope.updateProduct= function(){
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
       	var dataObj = {
          product_id: self.productId,
          name: self.product.name,
  				description : self.product.description,
          product_access : self.product.product_access,
          product_access_url : self.product.product_access_url,
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
              }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          myWarning($mdDialog,data);
              });  
     }
    };      


      }
    ]
  });
