'use strict';


// Register `dashboard` component, along with its associated controller and template
angular.
  module('dashboard',['ngSanitize']).
  component('dashboard', {

    templateUrl: 'dashboard/dashboard.template.html',
    controller: ['$routeParams','$scope','$rootScope','$http',
      function DashboardDetailController($routeParams,$scope,$rootScope,$http) {
        var self = this;	//get stats
         $scope.succeeded = {left:"",right:""};
         $scope.execute = {left:"",right:""};
         $scope.errorMsg="";
         $scope.serviceOk=true;
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
            $scope.succeeded.left = {
              "width":self.stats.pct_execute_succeeded+"px",
              "background-color" : "rgb(0,153,255)",
          }
            var myPct=0;
            if (self.stats.nb_combination>0) myPct=Math.round(100*self.stats.nb_execute/self.stats.nb_combination);
            $scope.execute.left = {
              "width":myPct+"px",
              "background-color" : "rgb(0,153,255)",
          }
            $rootScope.globalLoading--;

            $rootScope.globalLoading++;
           	$http.get('/node/listMostCompletedCases').
              success(function(data) {
                $rootScope.MostCompletedTestCaseList=data;//self.cas = data;
                $rootScope.globalLoading--;
      
                $rootScope.globalLoading++;
                $http.get('/node/listLastCases').
                  success(function(data) {
                    $rootScope.LastTestCaseList=data;//self.cas = data;
                    
                    $rootScope.globalLoading--;
      
//	    $scope.loading--;
                  }).error(function (data, status, headers, config) {
                    $rootScope.globalLoading--;
                }); 
      
      
//	    $scope.loading--;
            }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
              }); 
      
            $rootScope.globalLoading++;
           	$http.get('/node/listBestProviders').
              success(function(data) {
                self.bestProviderList=data;
                $rootScope.globalLoading--;      
      
//	    $scope.loading--;
            }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
              }); 

            $rootScope.globalLoading++;
           	$http.get('/node/listBestAssociations').
              success(function(data) {
                self.bestAssociations=data;
                $rootScope.globalLoading--;      
      
//	    $scope.loading--;
            }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
              }); 
              
              
            $rootScope.globalLoading++;
           	$http.get('/node/listCategories').
              success(function(data) {
                //self.categories=data;
                self.categories = new Array();
                var j=0;
                var pct_ok=0;
                var tranche_ok=0;
                  self.nb_ok_total=0;
                  self.nb_ko_total=0;
	              for (j=0;j<data.length;j++){
                  pct_ok=0;
                  tranche_ok=0;
                  tranche_ok = get_tranche(data[j].nb_ok,data[j].nb_ko);
                  
                  data[j].tranche_ok = tranche_ok;
                  self.nb_ok_total += parseInt(data[j].nb_ok); 
                  self.nb_ko_total += parseInt(data[j].nb_ko); 
                  if ((parseInt(data[j].nb_ok)+parseInt(data[j].nb_ko))>0)
                   self.categories.push(data[j]);
                }
                var pct_ok_total=0;
                  self.tranche_ok_total = get_tranche(self.nb_ok_total,self.nb_ko_total);
                  self.signification_tranche_total = get_signification_tranche(self.tranche_ok_total);
                  
                $rootScope.globalLoading--;      
      
//	    $scope.loading--;
            }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
              }); 
      
      
//	    $scope.loading--;
          }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
                  var isErrorTreated = false;
                  if (typeof data == "string")
                    if (data.startsWith("<!DOCTYPE HTML")){
                      $scope.serviceOk=false;
                      $scope.errorMsg=data;
                      isErrorTreated = true;
                    }
                  if (!isErrorTreated)    
   			            alert( "failure: " + data);
                  
              }); 
              
              
      


      }
    ]
  });
