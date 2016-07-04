'use strict';

// Register `productList` component, along with its associated controller and template
angular.
  module('productList').
  component('productList', {
    templateUrl: 'product-list/product-list.template.html',
    controller: ['$http', '$rootScope', '$window' , 
		function ProductListController($http,$rootScope,$window) {
      var self = this;
      $rootScope.globalLoading++;
      $http.get('/node/listProducts?token='+
                        $window.localStorage['jwt']).
            success(function(data) {
            self.products = data;
            $rootScope.globalLoading--;
          })
          .error(function (data, status, headers, config) {
            $rootScope.globalLoading--;
          });

  }]
    
  });
