import { test, expect } from '@playwright/test'
import fs from 'fs'

function readJson(filepath: string) {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"))

}
test("e2e api", async ({ request }) => {


    const postrequestbody = readJson("apitestdata/post_request_body.json")
    const postresponse = await request.post("/booking", { data: postrequestbody })
    const postresponseBody = await postresponse.json()
    console.log(postresponseBody)
    expect(postresponse.ok()).toBeTruthy();
    expect(postresponse.status()).toBe(200)
    expect(postresponseBody).toHaveProperty("bookingid")

    const booking = postresponseBody.booking
    const bookingid = postresponseBody.bookingid

    expect(booking).toMatchObject({
        firstname: postrequestbody.firstname,
        lastname: postrequestbody.lastname,
        totalprice: postrequestbody.totalprice,
        depositpaid: postrequestbody.depositpaid,
        additionalneeds: postrequestbody.additionalneeds
    });

    expect(booking.bookingdates).toMatchObject({
        checkin: postrequestbody.bookingdates.checkin,
        checkout: postrequestbody.bookingdates.checkout,
    });

    // get booking id 

    const getrequestbody = await request.get((`/booking/${bookingid}`))

    const getresponsebody = await getrequestbody.json()

    console.log(getresponsebody)


    //creating token 

    const tokenrequestBody = readJson("apitestdata/token_request_body.json")
    const tokenresponse = await request.post('/auth ', { data: tokenrequestBody })
    const tokenresponsebody = await tokenresponse.json();
    const token = tokenresponsebody.token

    console.log(`token is ->>>> ${token}`)

    //sending put request

    const putrequestbody = readJson("apitestdata/put_request_body.json");
    const putresponse = await request.put(`/booking/${bookingid}`, {
        headers: { "cookie": `token=${token}` },
        data: putrequestbody
    }
    )

    const putresponsebody= await putresponse.json();
 console.log(putresponsebody)
    expect(putresponse.statusText()). toBe("OK");
    expect(putresponse.status()).toBe(200)

    // delete booking
    const deleteresponse= await request.delete(`/booking/${bookingid}`,{
        headers: {cookie : `token=${token}`}
    })
  //const deleteresponsebody= await deleteresponse.json()
     expect(deleteresponse.statusText()).toBe("Created");
    expect(deleteresponse.status()).toBe(201)

    console.log("Booking are deleted successfully.....")

});