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
const auth = firebase.auth();


const logoutBtn = document.querySelector('.logout-btn');
const tourMainTitle = document.querySelector('.tour-main-title');
const tourMainContent = document.querySelector('.tour-main-content');
const tourBannerImg = document.querySelector('#banner_image');
const field = document.querySelector('#field');
const formElement = document.querySelector('.contact-form');
const loader = document.querySelector('.loader');
const overlay = document.querySelector('#overlayer');
const loaderText = loader.querySelector('.loader-text');
const spinner = loader.querySelector('.spinner-border');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Retrieve the location object from localStorage
const data = JSON.parse(localStorage.getItem(`location-${id}`));

logoutBtn.addEventListener('click', async () => {
  await firebase.auth().signOut();
  window.location.href = '/';
});

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

const resetLoading = () => {
  loader.style.display = 'none';
  loaderText.textContent = ''; // Append the text
  spinner.style.display = 'block'
  overlay.style.display = 'none';
}

tourMainTitle.value = data.title;
tourMainContent.textContent = data.content;

data.tours.forEach((tour, index) => {
  const html = `<div id="field${index}" name="field${index}" class="tour-item-form">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label class="text-black" for="action_name"
            >Title</label
          >
          <input
            id="action_name"
            name="tour-title"
            type="text"
            placeholder=""
            class="form-control tour-title"
            value="${tour.tourTitle}"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label class="text-black" for="action_json"
            >Tour Image</label
          >
          <input
            type="file"
            id="action_json"
            name="tour-img"
            class="input-file form-control tour-img"
          />
          <div id="action_jsondisplay"></div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="text-black" for="content">Content</label>
      <textarea
        name="tour-content"
        class="form-control tour-content"
        id="content"
        cols="30"
        rows="5"
      >${tour.tourContent}</textarea>
    </div>
  </div>
  <button type="button" id="remove${index}" class="btn btn-danger remove-me mb-3" >Remove</button></div>`;

  field.insertAdjacentHTML('beforeend', html);
});

formElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('submit');

  const formData = new FormData(formElement);
  const title = formData.get('title');
  const content = formData.get('content');
  const tourBannerImageFile = formData.get('banner_image');
  const tourItemForms = document.querySelectorAll('.tour-item-form');

  if (tourBannerImageFile.name != '' && !tourBannerImageFile.type.startsWith('image/')) {
    alert('Banner image file must be an image.');
    resetLoading()
    return;
  }

  loader.style.display = 'block';
  // loaderText.textContent = 'Uploading images...'; // Append the text
  overlay.style.display = 'block';

  let tourBannerImgUrl = data.tourBannerImgUrl;
  if (tourBannerImageFile.name != '') {
    tourBannerImgUrl = await uploadImage(tourBannerImageFile);
  }

  const tours = [];

  let index = 0;
  for (const tourItemForm of tourItemForms) {
    const tourTitle = tourItemForm.querySelector('.tour-title').value;
    const tourContent = tourItemForm.querySelector('.tour-content').value;
    const tourImgFile = tourItemForm.querySelector('.tour-img').files[0];

    if (tourImgFile && !tourImgFile.type.startsWith('image/')) {
      alert('All tour files must be images.');
      resetLoading()
      return;
    }
    let tourImgUrl = data.tours[index].tourImgUrl;
    if (tourImgFile) {
      tourImgUrl = await uploadImage(tourImgFile);
    }
    tours.push({ tourTitle, tourContent, tourImgUrl });
  }

  const location = {
    title,
    content,
    tourBannerImgUrl,
    tours
  }
  await db.collection('tour_locations').doc(id).update(location);
  localStorage.setItem(`location-${id}`, JSON.stringify(location));

  loaderText.textContent = 'Successfull✅'; // Append the text
  spinner.style.display = 'none';

  await new Promise(r => setTimeout(r, 500));

  window.location.href = "/admin.html"
  resetLoading()
  formElement.reset();
});

auth.onAuthStateChanged(function (user) {
  if (!user) window.location.href = "/login.html";
});