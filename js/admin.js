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

const formElement = document.querySelector('.contact-form');
const loader = document.querySelector('.loader');
const overlay = document.querySelector('#overlayer');
const loaderText = loader.querySelector('.loader-text');
const spinner = loader.querySelector('.spinner-border');
const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', async () => {
  await firebase.auth().signOut();
  window.location.href = '/';
});

const tourTableBody = document.querySelector('.tour-table-body');
const blogTableBody = document.querySelector('.blog-table-body');


document.addEventListener('DOMContentLoaded', async function () {

  // tour location
  await db.collection("tour_locations").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const location = doc.data();

      const html = `<tr data-id=${doc.id}>
            <td>${location.title}</td>
            <td>
              <a href="/admin-edit-tour.html?id=${doc.id}">
                <button
                  type="button"
                  class="btn btn-success"
                  style="padding: 5px 15px"
                >
                  <img
                    src="images/edit-icon.png"
                    alt=""
                    srcset=""
                    width="20px"
                  />
                </button>
              </a>
              <button
                type="button"
                class="btn btn-danger delete-tour-btn"
                style="padding: 5px 15px"
              >
                <img
                  src="images/delete-icon.png"
                  alt=""
                  srcset=""
                  width="20px"
                />
              </button>
            </td>
          </tr>`;
      tourTableBody.insertAdjacentHTML('beforeend', html);
    })
  })

  const deleteTourBtns = document.querySelectorAll('.delete-tour-btn');
  deleteTourBtns.forEach(btn => btn.addEventListener('click', async (e) => {
    const tourId = e.target.closest('tr').dataset.id;
    await db.collection("tour_locations").doc(tourId).delete();
    window.location.reload();
  }))

  // blog posts
  await db.collection("blog_posts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const post = doc.data();
      console.log(doc.id, post);

      const html = `<tr data-id=${doc.id}>
            <td>${post.title}</td>
            <td>
              <a href="/admin-edit-blog.html?id=${doc.id}">
                <button
                type="button"
                class="btn btn-success"
                style="padding: 5px 15px"
                >
                <img
                src="images/edit-icon.png"
                alt=""
                srcset=""
                width="20px"
                />
                </button>
              </a>
              <button
                type="button"
                class="btn btn-danger delete-blog-btn"
                style="padding: 5px 15px"
              >
                <img
                  src="images/delete-icon.png"
                  alt=""
                  srcset=""
                  width="20px"
                />
              </button>
            </td>
          </tr>`;
      blogTableBody.insertAdjacentHTML('beforeend', html);
    })

    const deleteBlogBtns = document.querySelectorAll('.delete-blog-btn');
    deleteBlogBtns.forEach(btn => btn.addEventListener('click', async (e) => {
      const tourId = e.target.closest('tr').dataset.id;
      await db.collection("blog_posts").doc(tourId).delete();
      window.location.reload();
    }))

  })
})


auth.onAuthStateChanged(function (user) {
  if (!user) window.location.href = "/login.html";
});