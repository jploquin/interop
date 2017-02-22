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
            //group by component presentation
            self.componentType=new Array();
            var componentObject=new Array();
            var j=0;
            
            data.sort(function (a, b) {
              if (a.component_type<b.component_type)
                 return -1;
              if (a.component_type>b.component_type)
                 return 1;
              // a doit être égal à b
              return 0;            
            });
            if (data.length>0){
              var labelCour=data[0].component_type_label;;
              componentObject.push(data[0]);
              for (j=1;j<data.length;j++){
                if (data[j].component_type_label!=labelCour){
                  if (componentObject.length>0){
                    self.componentType.push({labelCour:labelCour,componentObject:componentObject});
                    componentObject= new Array();
                    componentObject.push(data[j]);
                  }
                  labelCour=data[j].component_type_label;
                }
                else{
                  componentObject.push(data[j]);
                  if (j==data.length-1){
                    self.componentType.push({labelCour:labelCour,componentObject:componentObject});
                  }
                }
              }
            }
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
