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
const loader = document.querySelector('.loader');
const overlay = document.querySelector('#overlayer');
const loaderText = loader.querySelector('.loader-text');
const spinner = loader.querySelector('.spinner-border');
const logoutBtn = document.querySelector('.logout-btn');

const uploadImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref();
        const uploadTask = storageRef.child('images/' + imageFile.name).put(imageFile);

        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log('Upload failed:', error);
            reject(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                resolve(downloadURL);
            });
        });
    });
}

logoutBtn.addEventListener('click', async () => {
    await firebase.auth().signOut();
    window.location.href = '/';
});

formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formElement);
    const title = formData.get('title');
    const content = formData.get('content');
    const bannerImageFile = formData.get('banner_image');
    const blogImageFiles = formData.getAll('blog_images');

    loader.style.display = 'block';
    loaderText.textContent = 'Uploading images...'; // Append the text
    overlay.style.display = 'block';

    const bannerImgUrl = await uploadImage(bannerImageFile);

    const blogImageUrls = [];
    for (const imageFile of blogImageFiles) {
        const imageUrl = await uploadImage(imageFile);
        blogImageUrls.push(imageUrl);
    }

    const docRef = await db.collection("blog_posts").add({
        title,
        content,
        bannerImgUrl,
        blogImageUrls
    });

    console.log("Document written with ID: ", docRef.id);
    loaderText.textContent = 'Successfull✅'; // Append the text
    spinner.style.display = 'none';

    await new Promise(r => setTimeout(r, 500));

    loaderText.textContent = '';
    loader.style.display = 'none';
    spinner.style.display = 'block'
    overlay.style.display = 'none';

    formElement.reset();
});


// firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         // User is signed in.
//         var docRef = db.collection("users").doc(user.uid);

//         docRef.get().then(function (doc) {
//             if (doc.exists) {
//                 if (doc.data().role === 'admin') {
//                     // User is an admin, allow access
//                 } else {
//                     // User is not an admin, redirect to home page
//                     window.location.href = "/";
//                 }
//             } else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//             }
//         }).catch(function (error) {
//             console.log("Error getting document:", error);
//         });
//     } else {
//         // No user is signed in, redirect to login page
//         window.location.href = "/login";
//     }
// });