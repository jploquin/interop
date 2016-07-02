'use strict';

// Register `dashboard` component, along with its associated controller and template
angular.
  module('dashboard').
  component('dashboard', {

    templateUrl: 'dashboard/dashboard.template.html',
    controller: ['$routeParams','$scope',
      function DashboardDetailController($routeParams,$scope) {
	$scope.loading=0;
        this.themeId = $routeParams.themeId;
      }
    ]
  });
