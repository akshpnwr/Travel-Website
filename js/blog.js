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

const blogPostsContainer = document.querySelector('.blog-items');

document.addEventListener('DOMContentLoaded', async function () {

  await db.collection("blog_posts").get().then((querySnapshot) => {

    // const blog_posts = [];
    let index = 0;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      const post = doc.data();
      let html = '';

      const trimmedContent = post.content.split(' ').slice(0, 90).join(' ') + '...';
      const readMoreContent = post.content.split(' ').slice(90).join(' ');
      if (index % 2 === 0) {
        html = `
                <section class="container position-relative travel-experts-container">
                <div class="row">
                  <div class="col-md-6">
                    <h1 class="travel-experts-heading">
                      ${post.title}
                    </h1>
                    <p class="charter-service-description">
                        ${trimmedContent}
                    </p>
                    <div class="read-more-button">
                      <span class="read-more-text">READ MORE</span>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed564ee5c65fc9dfa87d1dae52910c923b5309f807485ab97721f248c45b88f7?apiKey=bbddd5bf435648a288c40d6f8ca6b85c&"
                        alt="Read more icon"
                        class="read-more-icon"
                      />
                    </div>
                    <div class="row blog-content blog-content-mobile">
                      <p>
                        ${readMoreContent}
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="slider slider-right">
                    ${post.blogImageUrls.map((imageUrl, index) => `<img class="slider-img ${index === 0 ? 'slider-active' : ''}" src="${imageUrl}" />`)}
                    </div>
                  </div>
                </div>
                <div class="bg-div bg-div-right"></div>
                <div class="row blog-content blog-content-desktop">
                  <p>
                    ${readMoreContent}
                  </p>
                </div>
              </section>
                `;
      }
      else {
        html = `
                <section
                class="container position-relative travel-experts-container second-blog-container"
              >
                <div class="row second-blog">
                  <div class="col-md-6 second-blog-img">
                    <div class="slider slider-left">
                    ${post.blogImageUrls.map((imageUrl, i) => `<img class="slider-img ${i === 0 ? 'slider-active' : ''}" src="${imageUrl}" />`)}
                    </div>
                  </div>
                  <div class="col-md-6 second-blog-content">
                    <h1 class="travel-experts-heading">
                    ${post.title}
                    </h1>
                    <p class="charter-service-description">
                    ${trimmedContent}
                    </p>
                    <div class="read-more-button">
                      <span class="read-more-text">READ MORE</span>
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed564ee5c65fc9dfa87d1dae52910c923b5309f807485ab97721f248c45b88f7?apiKey=bbddd5bf435648a288c40d6f8ca6b85c&"
                        alt="Read more icon"
                        class="read-more-icon"
                      />
                    </div>
                    <div class="row blog-content blog-content-mobile">
                    ${readMoreContent}
                    </div>
                  </div>
                </div>
                <div class="bg-div bg-div-left"></div>
                <div class="row blog-content blog-content-desktop">
                  <p>
                    ${readMoreContent}
                  </p>
                </div>
              </section>
              `
      }
      blogPostsContainer.insertAdjacentHTML('beforeend', html);
      index++;
    });

  });

  const sliders = document.querySelectorAll('.slider');
  const readMoreBtns = document.querySelectorAll('.read-more-button');

  let currentIndex = 0;

  // Function to show next image and hide current image
  function showNextImage(sliderImages, currentIndex) {
    sliderImages[currentIndex].classList.remove('slider-active');

    // Calculate the index of the next image
    currentIndex = (currentIndex + 1) % sliderImages.length;

    // Show the next image
    sliderImages[currentIndex].classList.add('slider-active');

    return currentIndex;
  }

  // Function to start the slider
  function startSlider(sliderImages, currentIndex) {
    console.log('startSlider');
    intervalId = setInterval(() => {
      currentIndex = showNextImage(sliderImages, currentIndex);
    }, 3000);
  }

  sliders.forEach(slider => {
    const sliderImgs = slider.querySelectorAll('.slider-img');
    startSlider(sliderImgs, currentIndex)
  })

  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const blogContentMobile = btn.closest('.travel-experts-container').querySelector('.blog-content-mobile');
      const blogContentDesktop = btn.closest('.travel-experts-container').querySelector('.blog-content-desktop');

      blogContentMobile.classList.toggle('show');
      blogContentDesktop.classList.toggle('show');
    })
  })
});