'use strict';
/* 
	header site.

*/


function showAllCookies() {

var res="";
  /*  var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
     res+= name;
    	//document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    */
    var dso=document;
    alert(document);
}


 
angular.
  module('headsite',['ngMaterial']).
  component('headsite', {
    templateUrl: 'headsite/headsite.template.html',
    controller: ['$routeParams','$http','$rootScope','$scope','$window','$mdDialog',
      function headSiteController($routeParams,$http,$rootScope, $scope,$window,$mdDialog) {
 /*       this.caseId = $routeParams.caseId;
	      var self = this;
 	//get case details
  	$http.get('/nodeTest/getSSOLoginInfo?sso='+$routeParams.sso+'&sig='+$routeParams.sig).
            success(function(data) {
            $scope.loading--;
            self.myUser = data;
            }).error(function (data, status, headers, config) {
                $scope.loading--;
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  
*/

  // disconnect
  $scope.connect= function(){
	//get url redirection of the sso provider
//  	$http.get('/nodeTest/urlRedirect').
  	$http.get('/node/urlRedirect').
            success(function(data) {
            $window.location.href = data[0];
          }).error(function (data, status, headers, config) {
                
                myWarning($mdDialog,data);       			       //   alert( "failure: " + data);//JSON.stringify({data: data}));
              });

     
  };
  // disconnect
  $scope.disconnect= function(){
      $window.sessionStorage.clear();//$window.sessionStorage['myLogin']=null;
      $rootScope.connected=0;
      $rootScope.myLogin=null;
       $window.location.href = '#!/dashboard';

  //clean the cookie
  //  showAllCookies();
    /*
    	var dataObj = {
				test_header_case_id : self.caseId
		};	*/
/*       $http({
                url: 'https://forum.etalab.gouv.fr/admin/users/645/log_out',
                method: "delete",
//                data: dataObj,
//                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                  alert('disconnected');
                }).error(function (data, status, headers, config) {
     			          alert( "failure: " + data);
                });
*/                
     
  };



      }
    ]
  });
