'use strict';

// Register `dashboard` component, along with its associated controller and template
angular.
  module('dashboard').
  component('dashboard', {

    templateUrl: 'dashboard/dashboard.template.html',
    controller: ['$routeParams','$scope','$rootScope','$http',
      function DashboardDetailController($routeParams,$scope,$rootScope,$http) {
        var self = this;	//get stats
  $rootScope.globalLoading++;
//	$scope.loading++;
  	$http.get('/node/Stats').
            success(function(data) {
            self.stats = data;
            self.uhu="ee";
            //$scope.uhu="rr";
            self.stats.nb_combination = (self.stats.nb_products*self.stats.nb_products)*self.stats.nb_tests;
            self.stats.pct_execute_succeeded="NA";
            if (self.stats.nb_execute>0){
              self.stats.pct_execute_succeeded= Math.round(self.stats.nb_execute_succeeded*100/self.stats.nb_execute);
            }
            $rootScope.globalLoading--;
      
//	    $scope.loading--;
          }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          alert( "failure: " + data);
              }); 
      }
    ]
  });
