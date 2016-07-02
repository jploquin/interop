// Nodejs Server for email sol interop app



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

var connectionString = process.env.DATABASE_URL;
// ||
//'postgres://interop:fanfaron@localhost:5432/interop';

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
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT * FROM test_header_case where test_header_case_id="+id+
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
          return res.status(500).json({ success: false, data: err});
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
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM test_category where test_category_id="+id+";");

 
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
    var results = [];
    var id  = req.param('productId');
	
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT p.*, f.name as provider_name FROM product p left outer join provider f on p.provider_id=f.provider_id where product_id="+id+";");

 
        // Stream results back one row at a time
        query.on('row', function(row) {
	    console.log('End product'); 
        done(); 
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
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM test_category WHERE ETAT <> 99 ORDER BY name ASC;");
	
 
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
 
    var results = [];
    console.log('Start lisProducts'); 
 
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query(
		"SELECT p.*, prov.name as provider FROM product p, provider prov where p.provider_id=prov.provider_id AND p.ETAT<>99 ORDER BY p.name ASC;");
	
 
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
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM test_header_case where test_category_id = "+id+" AND ETAT <> 99 ORDER BY name ASC;");

 
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
          return res.status(500).json({ success: false, data: err});
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

//Create APIs
//-----------

//create a result
app.post('//saveResult', function (req, res) {
    console.log ('Start saveResult');
    var results = [];

    // Grab data from http request
    var data = req.body;
//    console.log(util.inspect(req, {showHidden: false, depth: null}));
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO test_result "+
            " (product_1_id, product_2_id, test_header_case_id, result, description, etat, test_user_id, datecre )"+
            "  values($1, $2, $3, $4, $5, $6, $7, current_timestamp) returning test_result_id", 
              [data.product_1_id, data.product_2_id, data.test_header_case_id, data.result, data.description, 3, 1],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).json({ success: false, data: err});
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
//  Preliminary verification
//  ------------------------
    if (req.body.name==""){
      err = "Name must not be empty";
      return res.status(500).send(({ success: false, data: err}));
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
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data header
        client.query("INSERT INTO test_header_case "+
            " (test_category_id, name, etat, cre_test_user_id, datecre )"+
            "  values($1, $2, $3, $4, current_timestamp) returning test_header_case_id", 
              [data.test_category_id, data.name, 3, 1],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                } else {
                    console.log('row inserted with id: ' + result.rows[0].test_header_case_id);
                    var header_id = result.rows[0].test_header_case_id;
                  // SQL Query > Insert Data test case
                  client.query("INSERT INTO test_case "+
                      " (test_header_case_id , description, expected_result, etat, cre_test_user_id, datecre )"+
                      "  values($1, $2, $3, $4, $5, current_timestamp) returning test_case_id", 
                        [header_id, data.description, data.expected_result, 3, 1],
                      function(err, result) {
                          if (err) {
                              console.log(err);
                              done();
                              return res.status(500).json({ success: false, data: err});
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

//  Preliminary verification
//  ------------------------
    if (!req.body.name || req.body.name.length==0){
      err = "Name must not be empty";
      return res.status(500).send(({ success: false, data: err}));
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
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE test_header_case SET name=($1), datemaj=current_timestamp WHERE test_header_case_id=($2)", [data.name, id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).json({ success: false, data: err});
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
                              return res.status(500).json({ success: false, data: err});
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

//  Preliminary verification
//  ------------------------
    if (!req.body.name || req.body.name.length==0){
      err = "Name must not be empty";
      return res.status(500).send(({ success: false, data: err}));
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
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE test_category SET name=($1), description=($2), datemaj=current_timestamp WHERE test_category_id=($3)", 
              [data.name, data.description,id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).json({ success: false, data: err});
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

//  Preliminary verification
//  ------------------------
    if (!req.body.name || req.body.name.length==0){
      err = "Name must not be empty";
      return res.status(500).send(({ success: false, data: err}));
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
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE product SET name=($1), description=($2), product_access=($3), product_access_url=($4), datemaj=current_timestamp WHERE product_id=($5)", 
              [data.name, data.description,data.product_access,data.product_access_url,id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).json({ success: false, data: err});
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

//  Preliminary verification
//  ------------------------


    // Grab data from http request
    var data = req.body;
    var id = data.test_result_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE test_result SET ETAT=99, datemaj=current_timestamp WHERE test_result_id=($1)", 
              [id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).json({ success: false, data: err});
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

//delete test case
app.put('//deleteTestCase', function(req, res) {
    console.log ('Start deleteTestCase');
  //  var id = req.param('testCaseId');
    var results = [];

    // Grab data from http request
    var data = req.body;
    var id = data.test_header_case_id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

//  Preliminary verification
//  ------------------------
// don't supress if test results
      var query = client.query("SELECT * FROM test_result where etat<>99 and test_header_case_id = "+id);

      // Stream results back one row at a time
      query.on('row', function(row) {
        err = "There are results attached to the test case";
        return res.status(500).send(({ success: false, data: err}));
      });

        // SQL Query > Update Data
        client.query("UPDATE test_header_case SET ETAT=99, datemaj=current_timestamp WHERE test_header_case_id=($1)", 
              [id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    done();
                    return res.status(500).json({ success: false, data: err});
                } else {
                    console.log('row updated');
                    done();
                    return res.json(results);                   
                }
              }                   
        );
    });
});


var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

