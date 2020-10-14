// Nodejs Server for email sol interop app


var querystring = require('querystring');
var crypto = require('crypto');
var jwt = require('jwt-simple');
var moment = require('moment');
var https = require('https');


var fs = require("fs");
var pg = require("pg");
var q = require("q");

//var dataMgt = require('./dataMgt');

//var tools = require('./utils');
var util = require('util');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(bodyParser.json());

var fs = require("fs");
var pg = require("pg");
var Promise = require('es6-promise').Promise;
app.set('jwtTokenSecret','mysecret');

var connectionString = process.env.DATABASE_URL;
//var myServer="54.149.55.192";
//var path="/interop/appv1/#!/login";
var port=process.env.PORT;
var login=process.env.LOGINURL;
var rand='12345';
var secret='mysecret';
var baseDiscourseRootUrl='forr';
var discourseRootUrl='https://'+baseDiscourseRootUrl;

var api_key=process.env.API_KEY;
var api_username=process.env.API_USERNAME;
var discourse_group=process.env.DISCOURSE_GROUP;
var GROUP_NAME="interop-messagerie";

// ||
//'postgres://interop:xxxxxxxxx@localhost:5432/interop';


//get stats
app.get('//Stats', function (req, res) {
    var results = [];
    console.log('Start stats'); 
 
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT * FROM stats;")
 
        // Stream results back one row 
        query.on('row', function(row) {
	console.log('End stats'); 
        done(); 
            return res.json(row);
 //           results.push(row);
        });

   });

});


//get header case
app.get('//HeaderCase', function (req, res) {
    var results = [];
    var id  = req.param('caseId');
    console.log('Start headercase'); 
 
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT *,(select name from param where etat<>99 and reference='component_type' and value=th.vertical_from_test_type) from_test_type_label,(select name from param where etat<>99 and reference='component_type' and value=th.vertical_to_test_type) to_test_type_label FROM test_header_case th where th.test_header_case_id="+id+
			" and etat <> 99;")
 
        // Stream results back one row 
        query.on('row', function(row) {
	console.log('End headercase'); 
        done(); 
            return res.json(row);
 //           results.push(row);
        });

   });

});



//getcase
app.get('//Case', function (req, res) {
console.log('Start case'); 
    var results = [];
    var id  = req.param('caseId');
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT * FROM test_case where test_header_case_id="+id+
			" and etat <> 99 order by test_case_id desc limit 1;")

      
              // Stream results back one row at a time
        query.on('row', function(row) {
	    console.log('End category'); 
        done(); 
            return res.json(row);
      });





   });

});



//getcategorie
app.get('//Category', function (req, res) {
console.log('Start category'); 
    var results = [];
    var id  = req.param('categoryId');
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT *,(select count(*) from test_result r, test_header_case_result c, test_header_case hc where r.test_result_id=c.test_result_id and c.test_header_case_id=hc.test_header_case_id and hc.test_category_id=tc.test_category_id and r.etat<>99 and r.result=1) nb_ok,(select count(*) from test_result r, test_header_case_result c, test_header_case hc where r.test_result_id=c.test_result_id and c.test_header_case_id=hc.test_header_case_id and hc.test_category_id=tc.test_category_id and r.etat<>99 and r.result=0) nb_ko FROM test_category tc where test_category_id="+id+";");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
	    console.log('End category'); 
        done(); 
            return res.json(row);
        });

   });

});

//get product
app.get('//Product', function (req, res) {
console.log('Start product'); 

    var detailAuthorized=false;
    var myTokenObject = getObjectFromToken(req.param('token'));
    var username= req.param('username');
    console.log('tok:'+myTokenObject);
    console.log('uname='+username);
    if (myTokenObject!=null && (verifyTokenObject2(myTokenObject,username))){
      detailAuthorized=true;
    }

    var results = [];
    var id  = req.param('productId');
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT p.*, f.name as provider_name,(select name from param where etat<>99 and reference='component_type' and value=p.component_type) component_type_label FROM product p left outer join provider f on p.provider_id=f.provider_id where product_id="+id+";");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
	    console.log('End product'); 
        done(); 
        if (!detailAuthorized){
          row.product_access="";
          row.product_access_url="";
        }
            return res.json(row);
 //           results.push(row);
        });

   });

});


//list catogories
app.get('//listCategories', function (req, res) {
 
    var results = [];
console.log('Start listcategory'); 
 
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT *,(select count(*) from test_result r, test_header_case_result c, test_header_case hc where r.test_result_id=c.test_result_id and c.test_header_case_id=hc.test_header_case_id and hc.test_category_id=tc.test_category_id and r.etat<>99 and r.result=1) nb_ok, (select count(*) from test_result r, test_header_case_result c, test_header_case hc where r.test_result_id=c.test_result_id and c.test_header_case_id=hc.test_header_case_id and hc.test_category_id=tc.test_category_id and r.etat<>99 and r.result=0) nb_ko FROM test_category tc WHERE ETAT <> 99 ORDER BY name ASC;");
	
 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
 	    console.log('End listcategory'); 
            done();
            return res.json(results);
        });

    });

});



//list product 
app.get('//listProducts', function (req, res) {
 
    var myType = req.param('product_type');
    var results = [];
    console.log('Start lisProducts'); 
    console.log('type::'+myType); 
   if (myType==null) myType=0;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT p.*, prov.name as provider,(select name from param where etat<>99 and reference='component_type' and value=p.component_type) as component_type_label FROM product p left outer join provider prov on  p.provider_id=prov.provider_id where p.ETAT<>99  and p.product_type="+myType+" ORDER BY p.name ASC;");
	
 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            console.log('End lisProducts'); 
            done();
            return res.json(results);
        });

    });

});



//list product 
app.get('//listProductsOutFromTestCase', function (req, res) {
 
    var test_header_case_id = req.param('test_header_case_id');
    var results = [];
    console.log('Start listProductsOutFromTestCase'); 
    console.log('test_header_case_id::'+test_header_case_id); 
   if (test_header_case_id==null) return res.status(500).send("no test header case id");
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT product_id from product_out_from_test_case where test_header_case_id = "+test_header_case_id+" and etat<>99 order by product_id");
	
 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            console.log('End listProductsOutFromTestCase'); 
            done();
            return res.json(results);
        });

    });

});


//list cases of a category
app.get('//listCases', function (req, res) {
 
    var results = [];
    var id = req.param('categoryId');
    console.log('Start lisCases'); 
 
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * ,(select count(*) from test_result r, test_header_case_result c where r.test_result_id=c.test_result_id and c.test_header_case_id=hc.test_header_case_id and r.etat<>99 and r.result=1) nb_ok,(select count(*) from test_result r, test_header_case_result c where r.test_result_id=c.test_result_id and c.test_header_case_id=hc.test_header_case_id and r.etat<>99 and r.result=0) nb_ko FROM test_header_case hc where test_category_id = "+id+" AND ETAT <> 99 ORDER BY name ASC;");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
           console.log('End lisCases'); 
           done();
            return res.json(results);
        });

    });

});

//list most completed test cases
app.get('//listMostCompletedCases', function (req, res) {
 
    var results = [];
//    var id = req.param('categoryId');
    console.log('Start listMostCompletedCases'); 
 
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT  t.*, (select count(*) from test_result where test_header_case_id=t.test_header_case_id and etat<>99) compte, (select name from test_category tc where tc.test_category_id=t.test_category_id) categoryName from test_header_case t where t.etat<>99 order by compte desc limit 5;");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
           console.log('End listMoreCompletedCases'); 
           done();
            return res.json(results);
        });

    });

});

//list most completed test cases
app.get('//listLastCases', function (req, res) {
 
    var results = [];
//    var id = req.param('categoryId');
    console.log('Start listLastCases'); 
 
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT  t.*,  (select name from test_category tc where tc.test_category_id=t.test_category_id) categoryName from test_header_case t where t.etat<>99 order by datecre desc limit 5;");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
           console.log('End listLastCases'); 
           done();
            return res.json(results);
        });

    });

});

//list best providers
app.get('//listBestProviders', function (req, res) {
 
    var results = [];
//    var id = req.param('categoryId');
    console.log('Start listBestProviders'); 
 
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT  p.*, (select sum(quantity*unit) from commitment where provider_id=p.provider_id and etat<>99) commitment from provider p where p.etat<>99 and (select sum(quantity*unit) from commitment where provider_id=p.provider_id and etat<>99)>0 order by commitment desc;");// limit 5;");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
           console.log('End listBestProviders'); 
           done();
            return res.json(results);
        });

    });

});

//list best associations
app.get('//listBestAssociations', function (req, res) {
 
    var results = [];
//    var id = req.param('categoryId');
    console.log('Start listBestAssociations'); 
 
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("select p1.name name1, p2.name name2,(select count(*) from test_result r, test_header_case_result c where r.test_result_id=c.test_result_id and c.product_1_id in (p1.product_id,p2.product_id) and c.product_2_id in (p1.product_id,p2.product_id) and r.etat<>99 and r.result=1) score_ok,(select count(*) from test_result r, test_header_case_result c where r.test_result_id=c.test_result_id and c.product_1_id in (p1.product_id,p2.product_id) and c.product_2_id in (p1.product_id,p2.product_id) and r.etat<>99 and r.result=0) score_ko from product p1, product p2 where p1.product_id<p2.product_id and p1.product_type=0 and p2.product_type=0 order by score_ok desc limit 5;");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
           console.log('End listBestAssociations'); 
           done();
            return res.json(results);
        });

    });

});


//list results of a case
app.get('//listResults', function (req, res) {
 
    var results = [];
    var id = req.param('caseId');
    console.log('Start lisResults'); 
 
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT t.*,u.name as username FROM test_result t left outer join test_user u on u.test_user_id=t.test_user_id "+
           " where t.test_header_case_id = "+id+
		    " AND t.ETAT <> 99 and u.etat<>99 ORDER BY t.test_result_id DESC;");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
           console.log('End lisResults'); 
           done();
            return res.json(results);
        });

    });

});

//list authorized vertical tests
app.get('//listAuthorizedVerticalTests', function (req, res) {
 
    var results = [];
console.log('Start list authorized vertical tests'); 
 
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
      return res.status(500).send(err);
        }

        // SQL Query > Select Data
        var query = client.query("SELECT *, (select name from param where etat<>99 and reference='component_type' and value=a.from_value) from_label,(select name from param where etat<>99 and reference='component_type' and value=a.to_value) to_label FROM authorized_vertical_test a WHERE ETAT <> 99 ORDER BY from_value desc, to_value desc;");
	
 
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
 	    console.log('End list authorized vertical tests'); 
            done();
            return res.json(results);
        });

    });

});


//Create APIs
//-----------

//create a result
app.post('//saveResult', function (req, res) {
    console.log ('Start saveResult');
    var results = [];
    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);
    }
    else
      userId = myTokenObject.userId;    


    // Grab data from http request
    var data = req.body;
//    console.log(util.inspect(req, {showHidden: false, depth: null}));
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO test_result "+
            " (product_1_id, product_2_id, test_header_case_id, result, description, etat, test_user_id, datecre )"+
            "  values($1, $2, $3, $4, $5, $6, $7, current_timestamp) returning test_result_id", 
              [data.product_1_id, data.product_2_id, data.test_header_case_id, data.result, data.description, 3, userId],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                          return res.status(500).send("Error while insert");
                } else {
                    console.log('row inserted with id: ' + result.rows[0].test_result_id);
                    // SQL Query > Select Data
                    var query = client.query("SELECT t.*,u.name as username FROM test_result t left outer join test_user u on u.test_user_id=t.test_user_id "+                                   " where test_result_id = "+result.rows[0].test_result_id);
            
                    // Stream results back one row at a time
                    query.on('row', function(row) {
                        results.push(row);
                    });
                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        console.log ('End saveResult');
                        done();
                        return res.json(results);
                    });
                }
              }                   
        );

 

    });
});

//create a test case
app.post('//saveTestCase', function (req, res) {
    console.log ('Start saveTestCase');
    var results = [];
    
    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);
    }
    else
      userId = myTokenObject.userId;    

    if (req.body.name==""){
      err = "Name must not be empty";
      return res.status(500).send(err);
    }


    // Grab data from http request
    var data = req.body;
//    console.log(util.inspect(req, {showHidden: false, depth: null}));
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
                return res.status(500).send(err);
        }

        // SQL Query > Insert Data header
        client.query("INSERT INTO test_header_case "+
            " (test_category_id, name, test_type, vertical_from_test_type, vertical_to_test_type, etat, cre_test_user_id, datecre )"+
            "  values($1, $2, $3, $4, $5, $6, $7, current_timestamp) returning test_header_case_id", 
              [data.test_category_id, data.name, data.test_type, data.vertical_from_test_type, data.vertical_to_test_type, 3, userId],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).send("Error while insert");
                } else {
                    console.log('row inserted with id: ' + result.rows[0].test_header_case_id);
                    var header_id = result.rows[0].test_header_case_id;
                  // SQL Query > Insert Data test case
                  client.query("INSERT INTO test_case "+
                      " (test_header_case_id , description, expected_result, etat, cre_test_user_id, datecre )"+
                      "  values($1, $2, $3, $4, $5, current_timestamp) returning test_case_id", 
                        [header_id, data.description, data.expected_result, 3, userId],
                      function(err, result) {
                          if (err) {
                              console.log(err);
                              done();
                                    return res.status(500).send("Error while insert");
                          } else {
                              console.log('row inserted with id: ' + result.rows[0].test_case_id);
                              // SQL Query > Select Data
                              var query = client.query("SELECT * FROM test_header_case where test_header_case_id = "+header_id);
                      
                              // Stream results back one row at a time
                              query.on('row', function(row) {
                                  results.push(row);
                              });
                              // After all data is returned, close connection and return results
                              query.on('end', function() {
                                  console.log ('End saveResult');
                                  done();
                                  return res.json(results);
                              });
                          }
                        }                   
                  );

                    
                }
              }      
               );
    });
});

//Updates
//-------
app.put('//updateTestCase', function(req, res) {
    console.log ('Start updateTestCase');
  //  var id = req.param('testCaseId');
    var results = [];

    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);
    }
    else
      userId = myTokenObject.userId;    

    if (!req.body.name || req.body.name.length==0){
      err = "Name must not be empty";
      return res.status(500).send(err);
    }
    

    // Grab data from http request
    var data = req.body;
    console.log('thename='+data.name);
    console.log(data);
    var id = data.test_header_case_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
                return res.status(500).send(err);
        }

        // SQL Query > Update Data
        client.query("UPDATE test_header_case SET name=($1), datemaj=current_timestamp WHERE test_header_case_id=($2)", [data.name, id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                          return res.status(500).send(err);
                } else {
                    console.log('row updated');
                    // SQL Query > Insert test case
                   client.query("INSERT INTO test_case "+
                      " (test_header_case_id , description, expected_result, etat, cre_test_user_id, datecre )"+
                      "  values($1, $2, $3, $4, $5, current_timestamp) returning test_case_id", 
                        [id, data.description, data.expected_result, 3, 1],
                      function(err, result) {
                          if (err) {
                              console.log(err);
                              done();
                                    return res.status(500).send("Error while insert");
                          } else {
                              console.log('row inserted with id: ' + result.rows[0].test_case_id);
                              console.log ('End saveResult');
                              done();
                              return res.json(results);
                          }
                        }                   
                  );
            
                    
                }
              }                   
        );

 
    });

});

app.put('//updateCategory', function(req, res) {
    console.log ('Start updateCategory');
  //  var id = req.param('testCaseId');
    var results = [];

    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);
    }
    else
      userId = myTokenObject.userId;    

    if (!req.body.name || req.body.name.length==0){
      err = "Name must not be empty";
      return res.status(500).send(err);
    }
    // Grab data from http request
    var data = req.body;
    var id = data.test_category_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }

        // SQL Query > Update Data
        client.query("UPDATE test_category SET name=($1), description=($2), maj_test_user_id=($3), datemaj=current_timestamp WHERE test_category_id=($4)", 
              [data.name, data.description, userId, id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).send(err);

                } else {
                    console.log('row updated');
                    console.log (id+'::'+data.description);
                    done();
                    return res.json(results);                   
                }
              }                   
        );

 
    });

});


app.put('//updateProduct', function(req, res) {
    console.log ('Start updateProduct');
  //  var id = req.param('testCaseId');
    var results = [];
    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);      
    }
    else
      userId = myTokenObject.userId;    
    
    if (!req.body.name || req.body.name.length==0){
      err = "Name must not be empty";
      return res.status(500).send(err);

    }
    // Grab data from http request
    var data = req.body;
    var id = data.product_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }

        // SQL Query > Update Data
        client.query("UPDATE product SET name=($1), description=($2), product_access=($3), product_access_url=($4), maj_test_user_id=($5), datemaj=current_timestamp WHERE product_id=($6)", 
              [data.name, data.description,data.product_access,data.product_access_url,userId,id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).send(err);
                } else {
                    console.log('row updated');
                    console.log (id+'::'+data.description);
                    done();
                    return res.json(results);                   
                }
              }                   
        );

 
    });

});

//delete, (not really, change the state)
app.put('//deleteResult', function(req, res) {
    console.log ('Start deleteResult');
  //  var id = req.param('testCaseId');
    var results = [];

    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);      
    }
    else
      userId = myTokenObject.userId;    



    // Grab data from http request
    var data = req.body;
    var id = data.test_result_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        
        
        
        // SQL Query > Select Data
        var query = client.query(
      		"select test_user_id FROM test_result WHERE test_result_id="+id);
 
        // Stream results back one row 
        query.on('row', function(row) {
        done(); 
        if (row.test_user_id != userId){
            console.log('bad user,test-result_id='+id+'datauserid='+row.test_user_id+'::userid='+userId);
            done();
            err = "You can't delete a result that you didn't create";
            return res.status(500).send(err); 
        }
        else{
        
           // SQL Query > Update Data
            client.query("UPDATE test_result SET ETAT=99, test_user_id=($1), datemaj=current_timestamp WHERE test_result_id=($2)", 
                  [userId,id],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        done();
                        return res.status(500).send(err);
                    } else {
                        console.log('row updated');
                        console.log (id+'::'+data.description);
                        done();
                        return res.json(results);                   
                    }
                  }                   
            );
          
        }
//            return res.json(row);
 //           results.push(row);
        });


        
        
        



  
    });

});


//delete test case
app.put('//deleteTestCase', function(req, res) {
    console.log ('Start deleteTestCase');
  //  var id = req.param('testCaseId');
    var results = [];
    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);      
    }
    else
      userId = myTokenObject.userId;    


    // Grab data from http request
    var data = req.body;
    var id = data.test_header_case_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }

//  Preliminary verification
//  ------------------------
// don't supress if test results
      var query = client.query("SELECT * FROM test_result where etat<>99 and test_header_case_id = "+id);
      var continu=true;

      // Stream results back one row at a time
      query.on('row', function(row) {
        err = "There are results attached to the test case";
        done();
        continu=false;
        
      });
      query.on('end', function(row) {
      if (!continu)
        return res.status(500).send(err);
      else{
        // SQL Query > Update Data
        client.query("UPDATE test_header_case SET ETAT=99, maj_test_user_id=($1), datemaj=current_timestamp WHERE test_header_case_id=($2)", 
              [userId,id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).send(err);
                } else {
                    console.log('row updated');
                    done();
                    return res.json(results);                   
                }
              }                   
        );
      }
      
     });
     });
});

app.put('//setProductOutFromTestCase', function(req, res) {
    console.log ('Start setProductOutFromTestCase');
  //  var id = req.param('testCaseId');
    var results = [];

    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);      
    }
    else
      userId = myTokenObject.userId;    



    // Grab data from http request
    var data = req.body;
    var test_id = data.test_header_case_id;
    var product_id = data.product_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        
        
        
        // SQL Query > Select Data
        var query = client.query(
      		"select product_out_from_test_case_id FROM product_out_from_test_case_id WHERE test_header_case_id="+test_id+" and product_id = "+product_id);
 
        // Stream results back one row 
        query.on('row', function(row) {
           // SQL Query > Update Data
            client.query("UPDATE product_out_from_test_case_id SET ETAT=3, usermaj=($1), datemaj=current_timestamp WHERE test_header_case_id=($2) and product_id=($3)", 
                  [userId,test_id,product_id],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        done();
                        return res.status(500).send(err);
                    } else {
                        console.log('row updated');
                        console.log (id+'::'+data.description);
                        done();
                        return res.json(results);                   
                    }
                  }                   
            );
        });
        //else{
        
         client.query("INSERT INTO product_out_from_test_case "+
            " (test_header_case_id , product_id, etat, usercre, datecre )"+
            "  values($1, $2, $3, $4, current_timestamp) returning product_out_from_test_case_id", 
              [test_id, product_id, 3, userId],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                          return res.status(500).send("Error while insert");
                } else {
                    console.log('row inserted with id: ' + result.rows[0].product_out_from_test_case_id);
                    console.log ('End saveResult');
                    done();
                    return res.json(results);
                }
              }                   
        );
          
        //}
//            return res.json(row);
 //           results.push(row);
        });


app.put('//setProductInFromTestCase', function(req, res) {
    console.log ('Start setProductInFromTestCase');
  //  var id = req.param('testCaseId');
    var results = [];

    var userId=0;
    
//  Preliminary verification
//  ------------------------

    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);      
    }
    else
      userId = myTokenObject.userId;    



    // Grab data from http request
    var data = req.body;
    var test_id = data.test_header_case_id;
    var product_id = data.product_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        
        
        
        // SQL Query > Select Data
        var query = client.query(
      		"select product_out_from_test_case_id FROM product_out_from_test_case_id WHERE test_header_case_id="+test_id+" and product_id = "+product_id+" and etat<>99");
 
        // Stream results back one row 
        query.on('row', function(row) {
           // SQL Query > Update Data
            client.query("UPDATE product_out_from_test_case_id SET ETAT=99, usermaj=($1), datemaj=current_timestamp WHERE test_header_case_id=($2) and product_id=($3)", 
                  [userId,test_id,product_id],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        done();
                        return res.status(500).send(err);
                    } else {
                        console.log('row updated');
                        console.log (id+'::'+data.description);
                        done();
                        return res.json(results);                   
                    }
                  }                   
            );
        });
        
        });

        
        
        



  
    });

});

//get url redirection for forum etalab discourse as sso provider
app.get('//urlRedirect', function (req, res) {
    var results = [];
    var nonce = crypto.createHash('sha1').update(rand).digest("hex");

    var payload = "";
    var returnUrl = login;//"http://"+myServer+path;
    payload=encodeURIComponent('nonce')+"="+encodeURIComponent(nonce);
    payload+="&";
    payload+=encodeURIComponent("return_sso_url")+"="+encodeURIComponent(returnUrl);
    var payload_b64=new Buffer(payload).toString('base64');
//    payload_b64=encodeURIComponent(payload_b64);
    var signature = crypto.createHmac('sha256',secret).update(payload_b64).digest('hex');
  
     var hmac = crypto.createHmac('sha256',secret);
    hmac.setEncoding('hex');
    hmac.write(payload_b64);
    hmac.end();
    signature=hmac.read(); 
console.log('sso'+payload_b64);
console.log('sig'+signature);

    var returnUrl = discourseRootUrl+'/session/sso_provider?sso='+payload_b64+'&sig='+signature;
    results.push(returnUrl);


return res.json(results);

});

//get url redirection 
app.get('//getSSOLoginInfo', function (req, res) {
    var results = [];
    var userId=99;//ADU
    var sig=req.param('sig');

    var b64string = req.param('sso');
    var buf = new Buffer(b64string,'base64');//Buffer.from(b64string, 'base64'); // Ta-da
    
    var bufdec = decodeURIComponent(b64string);
    var sig2 = crypto.createHmac('sha256',secret).update(b64string).digest('hex');

/*    // validate sso
    if(sig2 !== sig){
          console.log (sig);
          console.log (sig2);
          return res.status(500).json({ success: false, data: 'Authentication failed, bad signature'});
    }
    else{
*/      
      console.log('sso:'+b64string);
      console.log('ssodecodé:'+buf);
      var sbuf = buf.toString();
      var myDecode = querystring.parse(buf);
 //     console.log('parsing obj:'+querystring.parse('foo=2&fooa=3').toString());
      console.log('parsing obj:'+parseQuery(sbuf));
/*    }
*/

    myReturn = parseQuery(sbuf);
    var expire=moment().add('days',7).valueOf();
    myReturn.expire = expire;

    //verify that user is member of the right discourse group
    if (discourse_group.length>0 &&api_key.length>0){
      console.log('start discourse verif');
      
      var options = {
        host: baseDiscourseRootUrl,
        path: '/users/'+myReturn.username+'.json?api_key='+api_key+'&api_username='+api_username
      };
      
      callback = function(response) {
        var str = '';
      
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
        console.log('response from request');
          str += chunk;
        });//end response.on data
      
        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          var myGroups=JSON.parse(str);
          myGroups=myGroups["user"]["groups"];
          var fini=(myGroups.length==0);
          var trouve=false;
          var cpt=0;
          while(!fini){
            if (myGroups[cpt].name==GROUP_NAME){
              fini=true;
              trouve=true;
            }
            else{
              cpt++;
              fini = (cpt>=myGroups.length);
            }
          }
        if (!trouve){
          return res.status(500).send("You must be in the interoperability group");  
        }
        else {
        console.log('trouve');
        // Get a Postgres client from the connection pool
        pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }        

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM test_user where user_sso_id = "+myReturn.external_id+" AND ETAT <> 99 LIMIT 1");
        var cpt=0;

        // Stream results back one row at a time
        query.on('row', function(row) {
          userId=row.test_user_id;
          console.log('user found:'+userId);
          done();
          cpt++;
        });
        
        query.on('end', function(row) {
           if (cpt==0){
                console.log('mon cpt: '+cpt);
                client.query("INSERT INTO test_user "+
                    " (name, email, user_sso_id, etat, datecre )"+
                    "  values($1, $2, $3, $4, current_timestamp) returning test_user_id", 
                      [myReturn.username, myReturn.email, myReturn.external_id, 3],
                      function(err, result) {
                        if (err) {
                            console.log(err);
                            done();
                            return res.status(500).send("Error while insert");
                            
                        } else {
                            console.log('row inserted with id: ' + result.rows[0].test_user_id);
                            console.log ('End userAccount');
                            userId=result.rows[0].test_user_id;
                            done();
                            myReturn.userId=userId;
                            console.log('myId'+myReturn.userId);
                            var token=jwt.encode(myReturn,app.get('jwtTokenSecret'));
                            
                            myReturn.token=token;
                            console.log(myReturn);
                            results.push(myReturn);
                            return res.json(myReturn);
                        }
                      }                   
                );
    
            }
            else{
                myReturn.userId=userId;
                console.log('myId'+myReturn.userId);
                var token=jwt.encode(myReturn,app.get('jwtTokenSecret'));
                
                myReturn.token=token;
                console.log(myReturn);
                results.push(myReturn);
                return res.json(myReturn);
            }

        });
         
        
      });

  }

        });//end response on end
         response.on('error', function () {
          return res.status(500).send("Impossible to verify group attachment");
        });
     }
      console.log('options'+options.host+options.path);
      https.request(options, callback).end();


    }  
    else {
      console.log('impossible to verify');    
    return res.status(500).send("Impossible to verify group attachment");
    }
    
    
    
    
// return res.json(myReturn);
   
    
    //todo: insert user
    //results.push('yy');
   //console.log('ret='+results);
//return res.status(500).send(err);


});


//crash on purpose
app.get('//crash', function (req, res) {
    var results = [];
  /*  
    
    var myTokenObject = getObjectFromToken(req.body.token);
    if (myTokenObject==null || (!verifyTokenObject(myTokenObject,req))){
      err = "Action not permitted";
      return res.status(500).send(err);      
    }
    else {
      userId = myTokenObject.userId;    
*/

    var myMonkey=12;
    var myBadAss=0;
    myMonkey= myMonkey/myBadAss;

return res.json(results);

});


function isUserExists(myReturn){

  var userId=0;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return userId;
        }
        

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM test_user where user_sso_id = "+myReturn.external_id+" AND ETAT <> 99 LIMIT 1");
        



        // Stream results back one row at a time
        query.on('row', function(row) {
          userId=row.test_user_id;
          console.log('user found:'+userId);
          done();
          return userId;
        });
      });

}


//search user returned by sso in the local database
function getUserId(myReturn){

    var userId=1;
    var cpt=0;
   
    var myUser=isUserExists(myReturn);
  if (myUser){
    console.log('exist'+myUser);
    return myUser;
    
    }
    /*
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return userId;
        }
        

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM test_user where user_sso_id = "+myReturn.external_id+" AND ETAT <> 99 LIMIT 1"), function(err, res) {
            if(err) console.log(err);
            deferred.resolve(res);
        });
        



        // Stream results back one row at a time
        query.on('row', function(row) {
          cpt++;
          userId=row.test_user_id;
          console.log('user found:'+userId);
          done();
          return userId;
        });
        
        
        query.on('end', function(row) {
           if (cpt==0){
                console.log('mon cpt: '+cpt);
                client.query("INSERT INTO test_user "+
                    " (name, email, user_sso_id, etat, datecre )"+
                    "  values($1, $2, $3, $4, current_timestamp) returning test_user_id", 
                      [myReturn.username, myReturn.email, myReturn.external_id, 3],
                      function(err, result) {
                        if (err) {
                            console.log(err);
                            done();
                            return userId;
                            
                        } else {
                            console.log('row inserted with id: ' + result.rows[0].test_user_id);
                            console.log ('End userAccount');
                            userId=result.rows[0].test_user_id;
                            done();
                            return userId;
                        }
                      }                   
                );
    
            }
            else
              return userId;

        });
 

    });
    */
}


//util functions, to be put in another file
//-----------------------------------------


function parseQuery(search) {

    var args = search.substring(1).split('&');
    var argsParsed = {};
    var i, arg, kvp, key, value;
    for (i=0; i < args.length; i++) {
        arg = args[i];
        if (-1 === arg.indexOf('=')) {
            argsParsed[decodeURIComponent(arg).trim()] = true;
        }
        else {
            kvp = arg.split('=');
            key = decodeURIComponent(kvp[0]).trim();
            value = decodeURIComponent(kvp[1]).trim();
            argsParsed[key] = value;
        }
    }
    return argsParsed;
}


function getObjectFromToken(token){

  var myObj=null;
  if (token) {
    try {
      var myObj = jwt.decode(token, app.get('jwtTokenSecret'));
  
      // handle token here
  
    } catch (err) {
      return myObj;
    }
  }
  return myObj;
}

function verifyTokenObject(myTokenObject,req){
  var ret=true;
  if (myTokenObject.username != req.body.username){
      ret = false;   
      console.log('uname');
    } else if (myTokenObject.expire <= Date.now()) {
       ret = false;   
       console.log('date');  
    }
    return ret;
}

function verifyTokenObject2(myTokenObject,username){
  var ret=true;
  if (myTokenObject.username != username){
      ret = false;   
      console.log('uname');
    } else if (myTokenObject.expire <= Date.now()) {
       ret = false;   
       console.log('date');  
    }
    return ret;
}
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

