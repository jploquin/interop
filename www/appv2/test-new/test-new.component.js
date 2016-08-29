'use strict';

// Register `testNew` component, along with its associated controller and template
angular.
  module('testNew',['ngMaterial']).
  component('testNew', {
  templateUrl: 'test-new/test-new.template.html',
    controller: ['$routeParams','$location','$window','$scope','$http','$mdDialog','$rootScope',
      function TestNewController($routeParams,$location,$window,$scope,$http,$mdDialog,$rootScope) {
        this.name="";
        this.description="";
        this.expected_result="";
        this.authorizedVerticalTests=null;
        this.categoryId = $routeParams.categoryId;
        this.test_type=0;
        this.from_to_choice="4:1";//bad, specif to email it app
        var self=this;
        	//get category name
      $rootScope.globalLoading++;
  	  $http.get('/node/Category?categoryId='+this.categoryId+'&token='+
			  $window.localStorage['jwt']).
            success(function(data) {
            self.category = data;
            $rootScope.globalLoading--;
            
            $rootScope.globalLoading++;
            $http.get('/node/listAuthorizedVerticalTests?token='+
                              $window.localStorage['jwt']).
                  success(function(data) {
                 // self.components = data;
                  self.authorizedVerticalTests = data;
                  $rootScope.globalLoading--;
                })
                .error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
                });
                  
            
            
          });


 // write the new test case
 this.save= function(){
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
     }
       else{
          var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
          var fromto = self.from_to_choice.split(':');
       	var dataObj = {
          test_category_id: self.categoryId,
          name: self.name,
  				description : self.description,
          expected_result: self.expected_result,
          test_type: self.test_type,
          vertical_from_test_type: fromto[0],
          vertical_to_test_type: fromto[1],
          username: myObj.username,
          token: myObj.token
  
  		};	
   $rootScope.globalLoading++;  
   $http({
              url: '/node/saveTestCase',
              method: "POST",
              data: dataObj,
              headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
          $rootScope.globalLoading--;
          //myWarning($mdDialog,"ok");
                var myNewTestCase = data; 
                $window.location.href = "#!/case/"+data[0].test_header_case_id;             
              }).error(function (data, status, headers, config) {
              $rootScope.globalLoading--;
                  //myWarning($mdDialog,data);
   			          myWarning($mdDialog, data );
              });  
  }
  }
  



	}
   ]
    
  });
