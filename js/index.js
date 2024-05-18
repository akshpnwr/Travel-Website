// google reviews api
// const apiKey = 'AIzaSyDPEBHU_sCUeKz6ZIuMRRNjgi_x_7YFZ48';
// const placeId = 'ChIJUarf7WLRCDkRbn6R4O1ZN7U';

// // const url = 'http://localhost:3001/place-details';
// const url = 'https://express-proxy-jcby.onrender.com/place-details';

// const fetchReviews = async () => {
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         if (data.result) {
//             const reviews = data.result.reviews || [];
//             reviews.forEach(review => {
//                 console.log(`Author: ${review.author_name}, Rating: ${review.rating}, Review: ${review.text}`);
//             });
//         } else {
//             console.log('No results found.');
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// fetchReviews();

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

const tourSlider = document.querySelector('.tour-slider');

document.addEventListener('DOMContentLoaded', async function () {

    await db.collection("tour_locations").get().then((querySnapshot) => {
        const sliderItemHtml = []
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            const location = doc.data();
            console.log(location);
            // Store the location object in localStorage
            localStorage.setItem(`location-${doc.id}`, JSON.stringify(location));

            let html = `<div class="item">
                        <a
                            class="media-thumb"
                            data-fancybox="gallery"
                            href="tour.html?id=${doc.id}"
                            target="_blank"
                            >
                            <div class="media-text">
                                <h3>${location.title}</h3>
                                <span class="location">Italy</span>
                            </div>
                            <img
                                src="${location.tourBannerImgUrl}"
                                alt="Image"
                                class="img-fluid"
                            />
                        </a>
                    </div> 
              `;
            sliderItemHtml.push(html);
        })
        tourSlider.innerHTML = sliderItemHtml.join('');
        // Reinitialize Owl Carousel
        $('.owl-carousel').owlCarousel('destroy');
        $('.owl-carousel').owlCarousel({
            // Your options here
        });
    })
});
