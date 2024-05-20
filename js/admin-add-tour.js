import { firebaseConfig } from "./firebaseConfig.js";

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

const getTours = async () => {
    return tours;
}

const resetLoading = () => {
    loader.style.display = 'none';
    loaderText.textContent = ''; // Append the text
    spinner.style.display = 'block'
    overlay.style.display = 'none';
}

formElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formElement);
    const title = formData.get('title');
    const content = formData.get('content');
    const tourBannerImageFile = formData.get('banner_image');
    const tourItemForms = document.querySelectorAll('.tour-item-form');

    if (!tourBannerImageFile.type.startsWith('image/')) {
        alert('Banner image file must be an image.');
        resetLoading()
        return;
    }

    loader.style.display = 'block';
    // loaderText.textContent = 'Uploading images...'; // Append the text
    overlay.style.display = 'block';

    const tourBannerImgUrl = await uploadImage(tourBannerImageFile);

    const tours = [];

    for (const tourItemForm of tourItemForms) {
        const tourTitle = tourItemForm.querySelector('.tour-title').value;
        const tourContent = tourItemForm.querySelector('.tour-content').value;
        const tourImgFile = tourItemForm.querySelector('.tour-img').files[0];
        if (!tourImgFile.type.startsWith('image/')) {
            alert('All tour files must be images.');
            resetLoading()
            return;
        }
        const tourImgUrl = await uploadImage(tourImgFile);
        console.log(tourImgUrl);
        tours.push({ tourTitle, tourContent, tourImgUrl });
    }

    const location = {
        title,
        content,
        tourBannerImgUrl,
        tours
    }
    console.log(location);

    const docRef = await db.collection("tour_locations").add(location);
    console.log("Document written with ID: ", docRef.id);
    loaderText.textContent = 'Successfull✅'; // Append the text
    spinner.style.display = 'none';

    await new Promise(r => setTimeout(r, 500));

    resetLoading()
    formElement.reset();
});


auth.onAuthStateChanged(function (user) {
    if (!user) window.location.href = "/login.html";
});