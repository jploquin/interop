'use strict';

// Register `returnSSO` component, along with its associated controller and template
/*angular.
  module('returnSSO').
  component('returnSSO', {

    templateUrl: 'returnSSO/returnSSO.template.html',
   // template: 'Nouveau theme: <p>saisie</p>',
    controller: ['$routeParams','$scope',
      function returnSSODetailController($routeParams,$scope) {
	$scope.loading=0;
   //     this.themeId = $routeParams.themeId;
      }
    ]
  });
  */
  
// Register `themeDetail` component, along with its associated controller and template
angular.
  module('returnSSO').
  component('returnSSO', {
  templateUrl: 'theme-new/theme-new.template.html',
//    template: 'Nouveau thème: <p>saisie</p>',
    controller: ['$routeParams','$location','$window',
      function returnSSONewController($routeParams,$location,$window) {
       // this.themeId = $routeParams.themeId;
        //this.foo=foo;
	//this.location=$location;
	//this.window=$window;
	function foo(){
this.window.location.href="#!/dashboard";	
//alert('ee');
	};
      }
   ]
    
  });

