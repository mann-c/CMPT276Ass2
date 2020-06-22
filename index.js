const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

var app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.get('/main', (req, res)=>{
    var getPersonQuery = `SELECT * FROM Person`;
    pool.query(getPersonQuery, (error, result)=>{
      if(error)
        res.end(error);
      
      var results = {'rows':result.rows};
      res.render('pages/main', results);
    })
  });

  app.get('/peoplepage', (req, res) => {
    var getPersonQuery = `SELECT * FROM Person`;
    pool.query(getPersonQuery, (error, result)=>{
      if(error)
        res.end(error);
      
      var results = {'rows':result.rows};
      res.render('pages/peoplepage', results);
    })
  });

  app.post('/addperson', (req, res) => {
    var name = req.body.name;
    var size = req.body.size;
    var height = req.body.height;
    var type = req.body.type;
    var age = req.body.age;
    var married = req.body.married;
    var number;

    var getPersonQuery = `SELECT MAX(ID) FROM Person`;
    pool.query(getPersonQuery, (error, result)=>{
      if(error)
        res.end(error);
      
      number = result.rows[0].max + 1;
      pool.query(`insert into person values(${number},'${name}', ${size}, ${height}, '${type}', ${age}, ${married})`, (error,result)=>{
        if(error)
          res.end(error);
      })
      res.redirect('/main');
    })
  });

  app.post('/deleteperson', (req, res) => {
    var id = req.body.id;

    var deleteQuery = `delete from person where id=${id}`;
    pool.query(deleteQuery, (error, result) => {
      if(error)
        res.end(error);
    })
    res.redirect('/main');
  });

  app.post('/editperson', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var size = req.body.size;
    var height = req.body.height;
    var type = req.body.type;
    var age = req.body.age;
    var married = req.body.married;

    var modifyQuery = `update person set name='${name}', size=${size}, height=${height}, 
      type='${type}', age=${age}, married=${married} where id=${id}`;
    pool.query(modifyQuery, (error, result) => {
      if(error)
        res.end(error);
    })
    res.redirect('/main');
  });

  app.get('/', (req, res) => res.render('pages/index'));
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
