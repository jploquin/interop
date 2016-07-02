'use strict';

// Register `testNew` component, along with its associated controller and template
angular.
  module('testNew').
  component('testNew', {
  templateUrl: 'test-new/test-new.template.html',
    controller: ['$routeParams','$location','$window','$scope','$http',
      function TestNewController($routeParams,$location,$window,$scope,$http) {
        this.name="";
        this.description="";
        this.expected_result="";
        this.categoryId = $routeParams.categoryId;
        var self=this;
        	//get category name
  	  $http.get('/node/Category?categoryId='+this.categoryId+'&token='+
			  $window.localStorage['jwt']).
            success(function(data) {
            self.category = data;
          });


 // write the new test case
 this.save= function(){
     	var dataObj = {
        test_category_id: self.categoryId,
        name: self.name,
				description : self.description,
        expected_result: self.expected_result
		};	
   
 $http({
            url: '/node/saveTestCase',
            method: "POST",
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
              var myNewTestCase = data; 
              $window.location.href = "#!/case/"+data[0].test_header_case_id;             
            }).error(function (data, status, headers, config) {
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  
  }
  



	}
   ]
    
  });
