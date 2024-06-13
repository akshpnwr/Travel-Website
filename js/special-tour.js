const heading = document.querySelector('.heading');
const content = document.querySelector('.content');
const price = document.querySelector('.price');
const tourSlider = document.querySelector('.tour-slider');

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const tours = JSON.parse(localStorage.getItem('tours'));
    const tour = tours.find(t => t.id === id);

    heading.textContent = tour.location;
    content.textContent = tour.tourContent;
    price.textContent = tour.tourPrice;

    if (!tour.tourImgExtraUrls || tour.tourImgExtraUrls.length === 0) {
        tourSlider.innerHTML = `<img
                src="./images/no-image.svg"
                class="img-fluid no-img rounded-20"
              />`
        return;
    }
    const sliderImgUrls = tour.tourImgExtraUrls;
    const tourSliderHtml = sliderImgUrls.map(url => {
        return `<img
                src="${url}"
                class="img-fluid rounded-20"
              />`
    })

    tourSlider.innerHTML = tourSliderHtml.join('');
})