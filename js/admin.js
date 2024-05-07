// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC8zCEHAmKsmNyaqAFceeQx1wxURgphLm4",
    authDomain: "travel-website-5eae7.firebaseapp.com",
    projectId: "travel-website-5eae7",
    storageBucket: "travel-website-5eae7.appspot.com",
    messagingSenderId: "448643634931",
    appId: "1:448643634931:web:c117e915480ad67809c986",
    measurementId: "G-RRENEGB7YK",
};

// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);

const formElement = document.querySelector('.contact-form');

formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formElement);
    const title = formData.get('title');
    const content = formData.get('content');
    const imageFile = formData.get('blog_image');
    const storageRef = storage.ref();
    const uploadTask = storageRef.child('images/' + imageFile.name).put(imageFile);

    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function (error) {
        console.log('Upload failed:', error);
    }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(async function (downloadURL) {
            console.log('File available at', downloadURL);

            const docRef = await db.collection("blog_posts").add({
                title: title,
                content: content,
                imageUrl: downloadURL
            });

            console.log("Document written with ID: ", docRef.id);
        });
    });
    formElement.reset();
});
