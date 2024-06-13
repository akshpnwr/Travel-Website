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
import firebaseConfig from "./firebaseConfig.js";

// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);

const tourSlider = document.querySelector('.tour-slider');
const customSelect = document.querySelector('.custom-select');
const searchBtn = document.querySelector('.search-btn');
const discountItemContainer = document.querySelector('.discount-item-container');

document.addEventListener('DOMContentLoaded', async function () {

    await db.collection("tour_locations").get().then((querySnapshot) => {
        const sliderItemHtml = []
        // Store the location objects in localStorage
        querySnapshot.forEach((doc) => {
            const location = doc.data();
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
                                <span class="location">Read more</span>
                            </div>
                            <img
                                src="${location.tourBannerImgUrl}"
                                alt="Image"
                                class="img-fluid"
                            />
                        </a>
                    </div> 
              `;

            const customSelectOption = `<option value="${doc.id}">${location.title}</option>`;
            customSelect.insertAdjacentHTML('beforeend', customSelectOption);
            sliderItemHtml.push(html);
        })
        tourSlider.innerHTML = sliderItemHtml.join('');
        // Reinitialize Owl Carousel
        $('.owl-carousel').owlCarousel('destroy');
        $('.owl-carousel').owlCarousel({
            // Your options here
            loop: true,
            margin: 10,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 3,
                    nav: false
                },

            }
        });
    })

    const locations = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("location-")) {
            const location = JSON.parse(localStorage.getItem(key));
            locations.push(location);
        }
    }
    console.log(locations);

    const tours = []

    locations.forEach(location => {
        location.tours.forEach(tour => {
            tours.push({ location: location.title, ...tour })
        })
    })

    localStorage.setItem('tours', JSON.stringify(tours));
    const discountItemHtml = []
    tours.forEach(tour => {
        const html = `
            <div class="item" data-id="${tour.id}">
                <div class="media-1">
                    <a href="special-tour.html?id=${tour.id}" target="_blank" class="d-block mb-3"
                    ><img
                    src="${tour.tourImgUrl}"
                    alt="Image"
                    class="img-fluid"
                    /></a>
                    <span class="d-flex align-items-center loc mb-2">
                    <span class="icon-room mr-3"></span>
                    <span>${tour.location}</span>
                    </span>
                    <div class="d-flex align-items-center">
                        <div>
                            <h3><a href="#">${tour.tourTitle}</a></h3>
                            <div class="price ml-auto">
                                <span>₹${tour.tourPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        discountItemHtml.push(html);
    })
    discountItemContainer.innerHTML = discountItemHtml.join('')

    $('.owl-carousel').owlCarousel('destroy');
    $('.owl-carousel').owlCarousel({
        // Your options here
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 3,
                nav: false
            },

        }
    });

});

searchBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const selectedLocationId = customSelect.value;
    // navigate to tour.html?id=selectedLocationId on a new window
    window.open(`tour.html?id=${selectedLocationId}`, '_blank');
});
