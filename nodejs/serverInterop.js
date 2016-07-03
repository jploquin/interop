// Nodejs Server for email sol interop app


var querystring = require('querystring');
var crypto = require('crypto');
var jwt = require('jwt-simple');
var moment = require('moment');


var fs = require("fs");
var pg = require("pg");

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
app.set('jwtTokenSecret','melissa');

var connectionString = process.env.DATABASE_URL;
//var myServer="54.149.55.192";
//var path="/interop/appv1/#!/login";
var login=process.env.LOGINURL;
var rand='12345';
var secret='nuitdebout';
var discourseRootUrl='https://forum.etalab.gouv.fr';
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
      return res.status(500).send(err);
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
      return res.status(500).send(err);
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
      return res.status(500).send(err);
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
      return res.status(500).send(err);
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
      return res.status(500).send(err);
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
                          return res.status(500).send(err);
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
            " (test_category_id, name, etat, cre_test_user_id, datecre )"+
            "  values($1, $2, $3, $4, current_timestamp) returning test_header_case_id", 
              [data.test_category_id, data.name, 3, userId],
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
                        [header_id, data.description, data.expected_result, 3, userId],
                      function(err, result) {
                          if (err) {
                              console.log(err);
                              done();
                                    return res.status(500).send(err);
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
                                    return res.status(500).send(err);
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

      // Stream results back one row at a time
      query.on('row', function(row) {
        err = "There are results attached to the test case";
        return res.status(500).send(err);
      });

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
    
    myReturn.userId=getUserId(myReturn);//userId;
    console.log('myId'+myReturn.userId);
    var token=jwt.encode(myReturn,app.get('jwtTokenSecret'));
    
    myReturn.token=token;
    console.log(myReturn);
    results.push(myReturn);
    //todo: insert user
    //results.push('yy');
   //console.log('ret='+results);

return res.json(myReturn);


});

//search user returned by sso in the local database
function getUserId(myReturn){

    var userId=1;
    var cpt=0;

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


var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

