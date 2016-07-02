'use strict';

// Register `productDetail` component, along with its associated controller and template
angular.
  module('productDetail').
  component('productDetail', {
    templateUrl: 'product-detail/product-detail.template.html',
    //template: 'TBD: Detail view for <span>{{$ctrl.productId}}</span>',
    controller: ['$routeParams','$http','$rootScope','$scope','$window',
      function productDetailController($routeParams,$http,$rootScope, $scope,$window) {
        this.productId = $routeParams.productId;
	      var self = this;
	      $scope.loading=0;
        $scope.loading++;

	//get details
  	$http.get('/node/Product?productId='+this.productId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.product = data;
	    $scope.loading --;
          });

 // update category
  $scope.updateProduct= function(){
     	var dataObj = {
        product_id: self.productId,
        name: self.product.name,
				description : self.product.description,
        product_access : self.product.product_access,
        product_access_url : self.product.product_access_url
  		};	
     $scope.loading++;  
     $http({
            url: '/node/updateProduct',
            method: "PUT",
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.loading--;      
            }).error(function (data, status, headers, config) {
              $scope.loading--;
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  
    };      


      }
    ]
  });
