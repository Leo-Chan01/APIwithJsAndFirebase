const admin = require("firebase-admin");

var serviceAccount = require("./firebase-servicekey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// const functions = require('firebase-functions');
const express = require('express');
const app = express();
const port = 8000;

const cors = require('cors');
app.use(cors({ origin: true }));
const db = admin.firestore();

app.post('/api/v1/create-user', (req, res) => {
    (async () => {
        try {
            await db.collection('users').doc('/' + req.body.id + '/').create({
                name: req.body.name,
                age: req.body.age,
                location: req.body.location
            });
            return res.status(201).send('successful creation')
        } catch (error) {
            console.log(error);
        }
    })();
});

// Reading
// app.get();
app.get('/hello-victor', (req, res) => {
    return res.status(200).send('Hello Victor, How are you?');
});

app.get('/api/v1/get-a-user/:id', (req, res) => {

    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            let user = await document.get();
            let response = user.data();

            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
        }
    })();
});

app.get('/api/v1/get-all-users', (req, res) => {
    (async () => {
        try {
            let query = db.collection('users');
            let response = [];

            await query.get().then(querySnapShot => {
                let docs = querySnapShot.docs;

                for (let doc of docs) {
                    const thisUser = {
                        id: doc.id,
                        name: doc.data().name,
                        age: doc.data().age
                    }

                    response.push(thisUser);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// Update
// app.put();
app.put('/api/v1/update-user/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            await document.update({
                name: req.body.name,
                age: req.body.age,
                location: req.body.location
            });
            return res.status(202).send('successful update')
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// Delete
// app.delete();

app.delete('/api/v1/delete-user/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('users').doc(req.params.id);
            await document.delete();
            return res.status(202).send('Successfully deleted');
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })
})

app.get('*', (req, res) => {
    res.status(404).send('Resource not found');
});

//export the express api
module.exports = app;

// exports.app = app.listen.onRequest(app);
// exports.app = app.listen((){

// })

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });