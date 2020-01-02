"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const express_1 = __importDefault(require("express"));
const pg_1 = __importDefault(require("pg"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const connectionString = 'postgres://moin@localhost:8080/api';
const client = new pg_1.default.Client(connectionString);
client.connect((err) => {
    if (!err) {
        console.log('Database connection succeeded');
    }
    else {
        console.log('Database connection failed\n' + JSON.stringify(err));
    }
});
const app = express_1.default();
const port = 3000;
let workbook = xlsx_1.default.readFile("assets/Book1.xlsx");
let worksheet = workbook.Sheets["Sheet1"];
let data = xlsx_1.default.utils.sheet_to_json(worksheet);
console.log(data);
console.log(data.length);
console.log(data[0][1]);
console.log(data[0]['Name']);
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.get("/users", (request, response) => {
    client.query('SELECT * FROM users', (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
            response.json(rows);
        }
    });
});
app.get("/delete", (request, response) => {
    client.query('TRUNCATE TABLE users RESTART IDENTITY', (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Delete Successful');
        }
    });
});
app.post("/deleteSelected", (request, response) => {
    for (let i = 0; i < request.body.length; i++) {
        client.query('delete from users where id=($1)', [request.body[i]], (err, rows, fields) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Delete Successful');
            }
        });
    }
});
app.post("/insert", (request, response) => {
    client.query('insert into users (name,email) values ($1,$2)', [request.body.name, request.body.email], (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
        }
    });
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
//# sourceMappingURL=app.js.map