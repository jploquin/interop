'use strict';

// Register `themeDetail` component, along with its associated controller and template
angular.
  module('themeNew').
  component('themeNew', {
  templateUrl: 'theme-new/theme-new.template.html',
//    template: 'Nouveau thème: <p>saisie</p>',
    controller: ['$routeParams','$location','$window',
      function ThemeNewController($routeParams,$location,$window) {
        this.themeId = $routeParams.themeId;
        this.foo=foo;
	this.location=$location;
	this.window=$window;
	function foo(){
this.window.location.href="#!/dashboard";	
//alert('ee');
	};
      }
   ]
    
  });
