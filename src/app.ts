import Xlsx from "xlsx";
import express, { response } from "express";
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import { request } from "http";

const connectionString = 'postgres://moin@localhost:8080/api';
const client = new pg.Client(connectionString);

client.connect((err) => {
  if (!err) {
    console.log('Database connection succeeded');
  } else {
    console.log('Database connection failed\n' + JSON.stringify(err));
  }
});


const app = express();
const port = 3000;

let workbook = Xlsx.readFile("assets/Book1.xlsx");

let worksheet = workbook.Sheets["Sheet1"];

let data = Xlsx.utils.sheet_to_json(worksheet);

console.log(data);
console.log(data.length);
console.log(data[0][1]);
console.log(data[0]['Name']);

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get("/users", (request, response) => {
  client.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      response.json(rows);
    }
  });
});

app.get("/delete", (request,response) => {
  client.query('TRUNCATE TABLE users RESTART IDENTITY', (err, rows, fields) => {
    if(err){
      console.log(err);
    }else {
      console.log('Delete Successful');
    }
  });
});

app.post("/deleteSelected", (request,response) => {
  for(let i = 0; i < request.body.length; i++){
    client.query('delete from users where id=($1)',[request.body[i]], (err, rows, fields) => {
      if(err){
        console.log(err);
      }else {
        console.log('Delete Successful');
      }
    });
  }
});


app.post("/insert", (request, response) => {
  
    client.query('insert into users (name,email) values ($1,$2)', [request.body.name, request.body.email], (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
      }
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
