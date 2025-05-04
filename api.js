const request = require('supertest');
const chai = require("chai");
const { expect } = chai;
const dotenv = require("dotenv");
dotenv.config();

const api = request(process.env.BASE_URL);
const data = require('./data.json');
let token;
let bookingID;
const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

describe("API Testing", function () {
  this.timeout(60000);

  //AUTHENTICATION
  it("Auth Token", async () => {
    const res = await api.post('/auth').send({
        username: process.env.USER,
        password: process.env.PASS,
      }
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');

    token = res.body.token;
    console.log("Token :", token);
  });

  //CREATE BOOKING
  it("Buat Booking Baru", async () => {
    const res = await api.post('/booking').set(header).send(data);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('bookingid');

    bookingID = res.body.bookingid; 
    console.log("Data booking baru telah terbuat!");
    console.log("Booking ID: ", bookingID);
  });

  //GET BOOKING
  it("Data Booking Yang Dibuat", async () => {
    const res = await api.get(`/booking/${bookingID}`).set(header);

    expect(res.status).to.equal(200);
    expect(res.body).to.include({
      firstname: data.firstname,
      lastname: data.lastname,
    });

    console.log("Data booking:", res.body);
  });

  //DELETE BOOKING
  it("Hapus Booking", async () => {
    const res = await api.delete(`/booking/${bookingID}`).set('Cookie', `token=${token}`);

    expect(res.status).to.equal(201);
    console.log("Data booking telah terhapus!");
    console.log("Booking ID: ", bookingID);
  });
});