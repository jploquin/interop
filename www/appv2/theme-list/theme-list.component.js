'use strict';

// Register `themeList` component, along with its associated controller and template
angular.
  module('themeList').
  component('themeList', {
    templateUrl: 'theme-list/theme-list.template.html',
    controller: ['$http', '$rootScope', '$window' , 
		function ThemeListController($http,$rootScope,$window) {
      var self = this;
      self.orderProp = 'age';

          $rootScope.globalLoading++;
          $http.get('/node/listCategories?token='+
                        $window.localStorage['jwt']).
            success(function(data) {
            self.themes = data;
            $rootScope.themes = data;
            $rootScope.globalLoading--;
          }).error(function (data, status, headers, config) {
            $rootScope.globalLoading--;
          });

  }]
    
  });
