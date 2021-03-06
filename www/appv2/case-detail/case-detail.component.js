'use strict';

/* 
	Case detail management.
	Manage case modifications and results modifications.
*/

function get_browser(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }
 
  


function transformationSupported(){
//i tried with modernizr but it didn't work ...
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;
var ret=isEdge;

if (!ret){
  var br = get_browser();
  var brname=br.name;
  var brversion=parseInt(br.version,10);
  
  if (brname=="Chrome" && brversion>=36) ret=true;
  else if (brname=="IE" && brversion>=10) ret=true;
  else if (brname=="Firefox" && brversion>=16) ret=true;
 else if (brname=="Safari" && brversion>=9) ret=true;
  else if (brname=="Opera" && brversion>=23) ret=true;
}
return ret;
}

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
   //position ok button on the cursor
   cx -=240;
   cy -=160;
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
  module('caseDetail',['ngMaterial']).
  component('caseDetail', {
    templateUrl: 'case-detail/case-detail.template.html',
    controller: ['$routeParams','$http','$rootScope','$scope','$window','$mdDialog',
      function caseDetailController($routeParams,$http,$rootScope, $scope,$window,$mdDialog) {
        this.caseId = $routeParams.caseId;
	var self = this;
	
  $scope.thRotatedClass="";
  $scope.tableRotatedClass="";
  if (transformationSupported()){
    $scope.thRotatedClass="rotate";
    $scope.tableRotatedClass="table-header-rotated";
  }
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
            if (self.headercase.name !=null) self.headercase.name=self.headercase.name.trim();
            if (self.headercase.test_type !=null){
               switch (self.headercase.test_type){
                 case 0:
                   self.headercase.test_type_label='Horizontal test (between solutions)';
                   break;
                 case 1:
                   self.headercase.test_type_label='Vertical test (between components)';
                   break;
                 default:
                   self.headercase.test_type_label='Horizontal test (between solutions)';
                   break;
                   
               }
            }
            $rootScope.globalLoading--;
            
             $rootScope.globalLoading++;
          	//get product list to construct the matrix of results: 
           //Depending of test type it could be products or components
            	$http.get('/node/listProducts?product_type='+self.headercase.test_type+'&token='+
          			$window.localStorage['jwt']).
                      success(function(data) {
                      self.products = data;
          	    var i=0;
          	    for ( i=0;i<self.products.length;i++){
              		self.products[i].rank = i+1;
              		self.products[i].label = self.products[i].rank;
                 
                  if (transformationSupported()){
                   self.products[i].label += ".  ";
                   self.products[i].label += self.products[i].name;
                  }
                }
                // self.results=0;  
                // $rootScope.globalLoading--;
          	//get result list to construct the matrix of results: 
            	$http.get('/node/listResults?caseId='+self.caseId+'&token='+
          			$window.localStorage['jwt']).
                      success(function(data) {
                      self.results = data;
          	          var i=0;
                      calculateViewResults(self.products, self.results, self.matrixResults);
                      $rootScope.globalLoading--;
             });
                     
            
            
                                                                        
	    //$scope.loading --;
          }).error(function (data, status, headers, config) {
                  $rootScope.globalLoading--;
   			          myWarning($mdDialog,data);//JSON.stringify({data: data}));
              });


 //       $scope.loading++;
  $rootScope.globalLoading++;
	//get case details
  	$http.get('/node/Case?caseId='+self.caseId+'&token='+
			$window.localStorage['jwt']).
            success(function(data) {
            self.case = data;
            if (self.case.description!=null) self.case.description = self.case.description.trim();
            if (self.case.expected_result!=null) self.case.expected_result = self.case.expected_result.trim();
            $rootScope.globalLoading--;
	   // $scope.loading --;
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

//      document.getElementById("writeResultOk").focus();        

	  }
  	};
	//cell clicked
	$scope.testKeyUp = function(event) {
      if(event.which === 27)
		    $scope.closeDiv();//loadingChangeResult=0;

//	  }
  	};
  // write a new result
  $scope.writeResult= function(testResult){
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
       $scope.closeDiv();
//       $scope.loadingChangeResult=0;
/*
       var elt = document.getElementById("changeResult"+self.product1.rank+"::"+self.product2.rank);
       if (elt!=null) elt.focus();
*/
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
      	var dataObj = {
  				description : self.theComment,
          product_1_id: self.product1.product_id,
          product_2_id: self.product2.product_id,
          test_header_case_id: self.caseId,
          result: testResult,
          username: myObj.username,
          token: myObj.token
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
                $scope.closeDiv();//$scope.loadingChangeResult=0;
              }).error(function (data, status, headers, config) {
   			          myWarning($mdDialog,data);
                  $scope.closeDiv();//$scope.loadingChangeResult=0;
              });  
     }
  };

  // delete a result
  $scope.deleteResult= function(testResultId){
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
      	var dataObj = {
				test_result_id : testResultId,
          username: myObj.username,
          token: myObj.token
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
       			          myWarning($mdDialog,data);
                  });  
     }
  };
  
  
  
  // update test case
  $scope.updateTestCase= function(){
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
       	var dataObj = {
          test_header_case_id: self.caseId,
          test_category_id: self.categoryId,
          name: self.headercase.name,
  				description : self.case.description,
          expected_result: self.case.expected_result,
          username: myObj.username,
          token: myObj.token
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
   			          myWarning($mdDialog,data);
              }); 
     } 
  };

  // delete a testcase
  $scope.deleteTestCase= function(){
    if (self.results.length>0){
      myWarning($mdDialog,"The test case can't be deleted: there are results attached to it");
    }
    else{
     if ($window.sessionStorage['myLogin']==null){
       myWarning($mdDialog,"You must be connected");
     }
     else{
        var myObj = JSON.parse(sessionStorage.getItem('myLogin'));    
      	var dataObj = {
  				test_header_case_id : self.caseId,
          username: myObj.username,
          token: myObj.token
  		};	
    
       $http({
                url: '/node/deleteTestCase',
                method: "PUT",
                data: dataObj,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                  $window.location.href = "#!/dashboard"
                }).error(function (data, status, headers, config) {
     			          myWarning($mdDialog,data);
                });
       }
   }  
  };


  $scope.nextTestCase = function(){
    var myList = $rootScope.currentTestCaseList;
    if (myList!=null && myList.length>0){
      var fini=myList.length==0;
      var trouve=false;
      var cpt=0;
      var monId=0;
      while (!fini){
        if (myList[cpt].test_header_case_id == self.caseId){
          fini=true;
          cpt++;
          if (cpt<myList.length) {
            trouve=true;
            monId = myList[cpt].test_header_case_id;
            
          }
        }
        else{
          cpt++;
          fini=(cpt>=myList.length);
        }
      }
      if (trouve){
        $window.location.href = "#!/case/"+monId;
      }
    }
    
  };
  $scope.previousTestCase = function($id){
    var myList = $rootScope.currentTestCaseList;
    if (myList!=null && myList.length>0){
      var fini=myList.length==0;
      var trouve=false;
      var cpt=0;
      var monId=0;
      while (!fini){
        if (myList[cpt].test_header_case_id == self.caseId){
          fini=true;
          cpt--;
          if (cpt>=0) {
            trouve=true;
            monId = myList[cpt].test_header_case_id;
            
          }
        }
        else{
          cpt++;
          fini=(cpt>=myList.length);
        }
      }
      if (trouve){
        $window.location.href = "#!/case/"+monId;
      }
    }
  };

  $scope.clickNewResult= function(){
  $scope.writeNewResult=true;
  setTimeout(function(){
   var elt = document.getElementById("resultComment");
    if (elt!=null) {
      elt.focus();
    }

},50);

  };

	$scope.closeDiv= function() {
		$scope.loadingChangeResult=0;
    var elt = document.getElementById("divChangeResult"+self.product1.rank+"::"+self.product2.rank);
    if (elt!=null) {
      elt.focus();
    }
/*setTimeout(function(){
   var elt = document.getElementById();
    if (elt!=null) {
      elt.focus();
    }

},50);
*/
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
	$scope.getTextResult = function ($rank1,$rank2) {
	  var ret="";
     ret = $scope.getLabelResult(self.matrixResults[$rank1-1][$rank2-1]);
/*	   switch (	self.matrixResults[$rank1-1][$rank2-1]){
		case -1: 
		  ret = "test not yet executed";
		  break;
		case 0: 
		  ret = "test failed";
		  break;
		case 1: 
		  ret = "test passed";
		  break;
	   }
       */
	 // }
	  return ret;
	};
	$scope.getLabelResult = function (res) {
	  var ret="";
	 // if ($rank1 != $rank2){
	   switch (	res){
		case -1: 
		  ret = "test not yet executed";
		  break;
		case 0: 
		  ret = "test failed";
		  break;
		case 1: 
		  ret = "test passed";
		  break;
	   }
	 // }
	  return ret;
	};

      }
    ]
  });
