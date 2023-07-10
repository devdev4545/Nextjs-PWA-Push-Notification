import { useEffect, useState } from "react";

let convertedVapidKey;

export default function Home() {
  const [endpoint, setEndpoint] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [keys, setKeys] = useState("");
  const [body, setBody] = useState("");

  const publicKey =
    "BDeEjWwSClAYzHE15bxl1I0vlnTryaLz8XrfiqpX_nq9sLnmrEL3W-q_y3628MGBjJ10XKFb21LKk1OQGBsrf9Q";

  useEffect(() => {
    if (typeof window !== "undefined") {
      convertedVapidKey = urlBase64ToUint8Array(publicKey);
      console.log(convertedVapidKey);
    }
  });

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    // eslint-disable-next-line
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function sendSubscription(subscription) {
    return fetch(`api/notification`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEndpoint(data.endpoint);
        setExpirationTime(data.expirationTime);
        setKeys(data.keys);
        setBody(data.body);
      });
  }

  function unSubscribe() {
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((subscription) => {
        if (subscription !== null) {
          subscription
            .unsubscribe()
            .then((successful) => {
              // You've successfully unsubscribed
            })
            .catch((e) => {
              // Unsubscribing failed
            });
        } else {
          console.log("nothing to unsubscribe");
        }
      });
    });
  }

  function subscribeUser() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(function (registration) {
          if (!registration.pushManager) {
            console.log("Push manager unavailable.");
            return;
          }

          registration.pushManager
            .getSubscription()
            .then(function (existedSubscription) {
              console.log("exisiting subscription");
              console.log(existedSubscription);
              console.log("................");
              if (existedSubscription === null) {
                console.log("No subscription detected, make a request.");
                registration.pushManager
                  .subscribe({
                    applicationServerKey: convertedVapidKey,
                    // applicationServerKey: publicKey,
                    userVisibleOnly: true,
                  })
                  .then(function (newSubscription) {
                    sendSubscription(newSubscription);
                  })
                  .catch(function (e) {
                    console.log(e);
                    setClientError(e.toString());
                    if (Notification.permission !== "granted") {
                      console.log("Permission was not granted.");
                    } else {
                      console.error(
                        "An error ocurred during the subscription process.",
                        e
                      );
                    }
                  });
              } else {
                console.log("Existed subscription detected.");
                sendSubscription(existedSubscription);
              }
            });
        })
        .catch(function (e) {
          console.error(
            "An error ocurred during Service Worker registration.",
            e
          );
        });
    }
  }

  return (
    <div className="p-0">
      <div className="container my-5">
        <br />
        <button onClick={subscribeUser}>Subscribe!</button>
        <button onClick={unSubscribe}>UnSubscribe!</button>
        <p>endpoint: {endpoint}</p>
        <p>expirationTime: {expirationTime || "null"}</p>
        <p>keys (auth): {keys.auth}</p>
        <p>keys (p256dh): {keys.p256dh}</p>
        <p>response: {body}</p>
      </div>
    </div>
  );
}
