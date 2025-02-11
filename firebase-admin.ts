import {initializeApp, getApps, App, getApp, cert} from "firebase-admin/app";


import {getFirestore} from "firebase-admin/firestore";

//const serviceKey = require("@/service_key.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

let app: App;

if (getApps().length === 0) {
    app = initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    app = getApp();
}

const adminDb = getFirestore(app);

export {app as adminApp, adminDb};