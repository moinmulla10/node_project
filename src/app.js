"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = __importDefault(require("xlsx"));
var workbook = xlsx_1.default.readFile('assets\Book1.xlsx');
var worksheet = workbook.Sheets[0];
var data = xlsx_1.default.utils.sheet_to_json(worksheet);
console.log(data);
