import {test, expect} from "@playwright/test";
import fs from 'fs';


test("create post request", async({request})=>{
    const jsonFile="apitestdata/post_request_body.json";
    const requestbody=JSON.parse(fs.readFileSync(jsonFile,'utf-8'))

    const response=await request.post("/booking",{data:requestbody})
    const responsebody=await response.json();
    console.log(responsebody);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    expect (responsebody).toHaveProperty("bookingid");
    expect (responsebody).toHaveProperty("booking");
    expect (responsebody).toHaveProperty("booking.additionalneeds");

    const booking=responsebody.booking;
    const bookingid=responsebody.bookingid;
    expect (bookingid).toBeGreaterThan(0);
    expect(booking).toMatchObject({
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 1000,
        depositpaid: true,
        additionalneeds: "super bowls",
    });
    expect(booking.bookingdates).toMatchObject({
        checkin: "2025-07-01",
        checkout: "2025-07-05",
    });
})