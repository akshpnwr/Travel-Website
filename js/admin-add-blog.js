import firebaseConfig from "./firebaseConfig.js";
// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);
const auth = firebase.auth();

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
    const blogImageFiles = formData.getAll('blog_images');

    for (const imageFile of blogImageFiles) {
        if (!imageFile.type.startsWith('image/')) {
            alert('All blog image files must be images.');
            return;
        }
    }

    loader.style.display = 'block';
    overlay.style.display = 'block';

    const blogImageUrls = [];
    for (const imageFile of blogImageFiles) {
        const imageUrl = await uploadImage(imageFile);
        blogImageUrls.push(imageUrl);
    }

    const docRef = await db.collection("blog_posts").add({
        title,
        content,
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


auth.onAuthStateChanged(function (user) {
    if (!user) window.location.href = "/login.html";
});