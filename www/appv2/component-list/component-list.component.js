'use strict';

// Register `componentList` component, along with its associated controller and template
angular.
  module('componentList').
  component('componentList', {
    templateUrl: 'component-list/component-list.template.html',
    controller: ['$http', '$rootScope', '$window' , '$scope', 
		function componentListController($http,$rootScope,$window,$scope) {
      var self = this;
      $rootScope.globalLoading++;
      $http.get('/node/listProducts?product_type=1&token='+
                        $window.localStorage['jwt']).
            success(function(data) {
           // self.components = data;
            $rootScope.components = data;
            $rootScope.globalLoading--;
          })
          .error(function (data, status, headers, config) {
            $rootScope.globalLoading--;
          });

/*	$scope.getcomponentLinkClassResult = function ($id) {
	  var ret="";
   var cpt=0;
   var monId=0;
   var myProds= $rootScope.components;
   var fini=(cpt>=myProds.length);
   var trouve=false;
   while (!fini){
      fini= (myProds[cpt].component_id==$id);
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
       if (myProds[cpt].component_access==null || myProds[cpt].component_access_url==null || 
         myProds[cpt].component_access.length==0 || myProds[cpt].component_access_url.length==0)
         ret="inactive_component";
     }
 
	  return ret;
	};
 */ 
    }]
    
  });
