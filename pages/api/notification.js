const webpush = require("web-push");

const publicKey =
  "BDeEjWwSClAYzHE15bxl1I0vlnTryaLz8XrfiqpX_nq9sLnmrEL3W-q_y3628MGBjJ10XKFb21LKk1OQGBsrf9Q";
const privateKey = "QhVLSPo2Ja5Dvgtp0qI9RFbEMVL0XTVzRnpOsXoMLgc";
const webPushContact = "mailto:contact@my-site.com";

webpush.setVapidDetails(webPushContact, publicKey, privateKey);

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const subscription = req.body;

    let response1 = "?";
    let response2 = "!!";
    const rndInt = randomIntFromInterval(1, 100);

    const payload = JSON.stringify({
      title: "Hello!",
      body: rndInt.toString(),
    });

    webpush
      .sendNotification(subscription, payload)
      .then((result) => {
        res.status(200).json({
          success: true,
          test: "7899",
          body: rndInt.toString(),
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: subscription.keys,
          thenRes: thenres,
          errorRes: response2,
        });
      })
      .catch((e) => {
        res.status(200).json({
          success: true,
          test: "123",
          body: rndInt.toString(),
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: subscription.keys,
        });
      });
  } else {
    // Handle any other HTTP method
  }
}
