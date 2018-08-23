// firebase init to init firebase project
// firebase deploy to send it to the cloud


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const fs = require('fs');
const UUID = require('uuid-v4');

// config for storage, porjectId - id of fb project
// key filename - file in functions folder downloaded from project settings -> service accounts -> create key
const gcconfig = {
  projectId: 'memento-1530788482372',
  keyFilename: 'keys.json'
};

const gcs = require('@google-cloud/storage')(gcconfig);

admin.initializeApp({
  credential: admin.credential.cert(require('./keys.json'))
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
  // corse used to accept requests from other hosts
  cors(request, response, () => {
    if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
      console.log('No token present!');
      response.status(403).json({error: 'Unauthorized'});
      return;
    }
    let idToken;
    idToken = request.headers.authorization.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken)
      .then(decodedToken => {
        // get body
        console.log(request.body)
        const body = request.body;
        // Save image to temporal file
        const imgPath = '/tmp/uploaded-image.jpg';
        // Synchronously writes the file, all code below will be executed only after it's done
        fs.writeFileSync(imgPath, body.image, 'base64', err => {
          // 4th arg - error handler
          console.log(err);
          return response.status(500).json({error: err});
        });
        // get firebase storage bucket, credential from storage tab in firebase
        const bucket = gcs.bucket('memento-1530788482372.appspot.com');
        const uuid = UUID();
        return bucket.upload(imgPath, {
          uploadType: 'media',
          destination: '/places/' + uuid + '.jpg',
          metadata: {
            metadata: {
              contentType: 'image/jpeg',
              firebaseStorageDownloadTokens: uuid
            },
          }
        }, (err, file) => {
          if (!err) {
            // get url to access the image with no access rights
            response.status(201).json({
              imagePath: '/places/' + uuid + '.jpg',
              imageUrl: 'https://firebasestorage.googleapis.com/v0/b/' +
              bucket.name +
              '/o/' +
              encodeURIComponent(file.name) +
              '?alt=media&token=' +
              uuid
            })
          } else {
            console.log(err);
            response.status(500).json({error: err})
          }
        })
      })
      .catch(err => {
        console.log('Token is invalid', err);
        return response.status(400).json({error: 'Unexpected error'})
      })
  });
});

exports.deleteImage = functions.database.ref('/{uid}/places/{placeId}/')
  .onDelete(snapshot => {
    const imagePath =  snapshot._data.imagePath;
    console.log(imagePath)
    const bucket = gcs.bucket('memento-1530788482372.appspot.com');
    return bucket.file(imagePath).delete();
  });
