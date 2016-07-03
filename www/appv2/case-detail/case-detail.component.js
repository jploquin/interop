'use strict';
/* 
	Case detail management.
	Manage case modifications and results modifications.
*/



//Calculate the position to make the changeresult div appear
function myPosition(element, thediv){
	var parentDiv = document.getElementById("divDetail").offsetParent;
        var cx = 0;
	var cy = element.clientHeight;
	var el2 = element;
	var trace="";
	while (el2 && el2 != parentDiv){
                if (el2.offsetLeft) cx += el2.offsetLeft;
                if (el2.offsetTop) cy += el2.offsetTop;
                el2 = el2.offsetParent;
 
	}
    return { top: cy, left: cx };
}

//get the rank of a product in the view
function getProductRank (products, id){
  var l = products.length;
  var fini=(l==0);
  var rk=0;
  var cpt=0;
  var rank=0;
  while(!fini){
    if (products[cpt].product_id==id){
      fini=true;
      rank=cpt;
    }
    else{
      cpt++;
      fini = (cpt==l);
    }
  }
  return rank;
}
 //get the result from id
function getResultFromId (results, id){
  var l = results.length;
  var fini=(l==0);
  var rk=0;
  var cpt=0;
  var res=null;
  while(!fini){
    if (results[cpt].test_result_id==id){
      fini=true;
      res=results[cpt];
    }
    else{
      cpt++;
      fini = (cpt==l);
    }
    
  }
  return res;
}
 
 function removeResultFromTab(id,tab){
  var l = tab.length;
  var fini=(l==0);
  var cpt=0;
  while(!fini){
    if (tab[cpt].test_result_id==id){
      fini=true;
      tab.splice(cpt,1);
    }
    else {
      cpt++;
      fini = (cpt==l);
    }
  }
}

function  calculateViewResults(products, results, matrixResults){
	    var j=0;
	    for (j=0;j<results.length;j++){
    		var monp1 = getProductRank(products,results[j].product_1_id);
    		var monp2 = getProductRank(products,results[j].product_2_id);
    		//only take the first result, it is the last and so the official one.
    		if (matrixResults[monp1][monp2]==-1)
    			matrixResults[monp1][monp2]=results[j].result;
	    } 
}

function  recalculateViewResults(products, results, matrixResults, myRes){
	    var j=0;
      var trouve=false;
      var fini=(results.length==0);
      var trouve=false;
      while (!fini){
        if (results[j].product_1_id == myRes.product_1_id &&
             results[j].product_2_id == myRes.product_2_id){
             fini=true;
          		var monp1 = getProductRank(products,results[j].product_1_id);
          		var monp2 = getProductRank(products,results[j].product_2_id);
              matrixResults[monp1][monp2]=results[j].result;
              trouve=true;
             }
        else{
          j++;
          fini=(j==results.length);
        }
      }
      if (!trouve){
          		var monp1 = getProductRank(products,myRes.product_1_id);
          		var monp2 = getProductRank(products,myRes.product_2_id);
              matrixResults[monp1][monp2]=-1;

      }
}

 
angular.
  module('caseDetail').
  component('caseDetail', {
    templateUrl: 'case-detail/case-detail.template.html',
    controller: ['$routeParams','$http','$rootScope','$scope','$window',
      function caseDetailController($routeParams,$http,$rootScope, $scope,$window) {
        this.caseId = $routeParams.caseId;
	var self = this;
	
	$scope.loading=0;
	$scope.loadingChangeResult=0;
	$scope.posTop="0px";
 	$scope.posLeft="0px";
  $scope.loading++;
  self.theComment="ddd"; //result comment
  self.matrixResults= new Array(64);//[64][64];//self.products.length][self.products.length];
  self.myRes = new Array(0);
  var i,j;
	    for (i=0;i<64;i++){
	      self.matrixResults[i]=new Array(64);
	      for (j=0;j<64;j++)
		self.matrixResults[i][j]=-1;
	}
	//get header details
  $rootScope.globalLoading++;
  	$http.get('/node/HeaderCase?caseId='+this.caseId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.headercase = data;
            $rootScope.globalLoading--;
	    //$scope.loading --;
          });


 //       $scope.loading++;
  $rootScope.globalLoading++;
	//get case details
  	$http.get('/node/Case?caseId='+this.caseId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.case = data;
            $rootScope.globalLoading--;
	   // $scope.loading --;
          });

//        $scope.loading++;
  $rootScope.globalLoading++;
	//get product list to construct the matrix of results: 
  	$http.get('/node/listProducts?token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.products = data;
	    var i=0;
	    for ( i=0;i<self.products.length;i++)
		self.products[i].rank = i+1;
	  //  $scope.loading --;
         
	//get result list to construct the matrix of results: 
  	$http.get('/node/listResults?caseId='+self.caseId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.results = data;
	          var i=0;
            calculateViewResults(self.products, self.results, self.matrixResults);
            $rootScope.globalLoading--;
   });

         
          });

	//cell clicked
	$scope.changeResult = function($rank1,$rank2) {
	  if ($rank1 != $rank2){
  		var myName = 'changeResult'+$rank1+'::'+$rank2;
  		var target = document.getElementById(myName);
  		var box = target.getBoundingClientRect();
  		var top = '';
  		
  		self.product1 = self.products[$rank1-1];
  		self.product2 = self.products[$rank2-1];
  		//position the div under the cell
  		var myDiv = document.getElementById("divChangeResult");
  		var center =  myPosition(target,myDiv);
  		$scope.posTop=center.top+"px";
  		$scope.posLeft=center.left+"px";
      $scope.writeNewResult=false;
  		$scope.oldResults=false;
      self.theComment="";
  		if (self.matrixResults[$rank1-1][$rank2-1]==-1){
        self.myRes= new Array(0);
  		  $scope.writeNewResult=true;
      }
  		else {
  	    var j=0;
       var cpt=0;
       self.myRes= new Array(0);
  	    for (j=0;j<self.results.length;j++){
          if (self.results[j].product_1_id == self.product1.product_id &&
              self.results[j].product_2_id == self.product2.product_id) {
            self.myRes[cpt]=self.results[j];
            cpt++;
            }
        }
		    $scope.oldResults=true;
		  }
		  $scope.loadingChangeResult++;

	  }
  	};

  // write a new result
  $scope.writeResult= function(testResult){
    	var dataObj = {
				description : self.theComment,
        product_1_id: self.product1.product_id,
        product_2_id: self.product2.product_id,
        test_header_case_id: self.caseId,
        result: testResult
		};	
   
 $http({
            url: '/node/saveResult',
            method: "POST",
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
              var r1 = getProductRank(self.products,self.product1.product_id);
              var r2 = getProductRank(self.products,self.product2.product_id);
              self.matrixResults[r1][r2]=testResult;
        			$scope.message = data;
              //put the new result at first
              self.results.splice(0,0,data[0]);
              $scope.loadingChangeResult=0;
            }).error(function (data, status, headers, config) {
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  
  };

  // delete a result
  $scope.deleteResult= function(testResultId){
    	var dataObj = {
				test_result_id : testResultId
		};	
   
   $http({
            url: '/node/deleteResult',
            method: "PUT",
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
               var myRes = getResultFromId(self.results,testResultId);
               removeResultFromTab(testResultId,self.myRes);
               removeResultFromTab(testResultId,self.results);
               recalculateViewResults(self.products, self.results, self.matrixResults, myRes); 
            }).error(function (data, status, headers, config) {
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  
  };
  
  
  
  // update test case
  $scope.updateTestCase= function(){
     	var dataObj = {
        test_header_case_id: self.caseId,
        test_category_id: self.categoryId,
        name: self.headercase.name,
				description : self.case.description,
        expected_result: self.case.expected_result
  		};	
     $scope.loading++;  
     $http({
            url: '/node/updateTestCase',
            method: "PUT",
            data: dataObj,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.loading--;      
            }).error(function (data, status, headers, config) {
              $scope.loading--;
 			          alert( "failure: " + JSON.stringify({data: data}));
            });  
  };

  // delete a result
  $scope.deleteTestCase= function(){
    	var dataObj = {
				test_header_case_id : self.caseId
		};	
    if (self.results.length>0){
      alert ("The test case can't be deleted: there are results attached to it");
    }
    else{
       $http({
                url: '/node/deleteTestCase',
                method: "PUT",
                data: dataObj,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                  $window.location.href = "#!/dashboard"
                }).error(function (data, status, headers, config) {
     			          alert( "failure: " + JSON.stringify({data: data}));
                });
   }  
  };



  $scope.clickNewResult= function(){
  $scope.writeNewResult=true;
  };

	$scope.closeDiv= function($rank1,$rank2) {
		$scope.loadingChangeResult=0;
	};
	$scope.getClassResult = function ($rank1,$rank2) {
	  var ret="cellResult icon-cross";
	  if ($rank1 != $rank2){
	   switch (	self.matrixResults[$rank1-1][$rank2-1]){
		case -1: 
		  ret = "cellResult icon-question";
		  break;
		case 0: 
		  ret = "cellResult icon-red";
		  break;
		case 1: 
		  ret = "cellResult icon-green";
		  break;
	   }
	  }
	  return ret;
	};

      }
    ]
  });
