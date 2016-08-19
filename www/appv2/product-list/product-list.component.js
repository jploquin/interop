'use strict';

// Register `productList` component, along with its associated controller and template
angular.
  module('productList').
  component('productList', {
    templateUrl: 'product-list/product-list.template.html',
    controller: ['$http', '$rootScope', '$window' , '$scope', 
		function ProductListController($http,$rootScope,$window,$scope) {
      var self = this;
      $rootScope.globalLoading++;
      $http.get('/node/listProducts?token='+
                        $window.localStorage['jwt']).
            success(function(data) {
           // self.products = data;
            $rootScope.products = data;
            $rootScope.globalLoading--;
          })
          .error(function (data, status, headers, config) {
            $rootScope.globalLoading--;
          });

	$scope.getProductLinkClassResult = function ($id) {
	  var ret="";
   var cpt=0;
   var monId=0;
   var myProds= $rootScope.products;
   var fini=(cpt>=myProds.length);
   var trouve=false;
   while (!fini){
      fini= (myProds[cpt].product_id==$id);
      if (fini)
        trouve=true;
      else
        {
         cpt++;
         fini=(cpt>=myProds.length);
       }
	 }
   if (trouve)
     if (myProds[cpt]!=null){
       if (myProds[cpt].product_access==null || myProds[cpt].product_access_url==null || 
         myProds[cpt].product_access.length==0 || myProds[cpt].product_access_url.length==0)
         ret="inactive_product";
     }
 
	  return ret;
	};
  
    }]
    
  });
