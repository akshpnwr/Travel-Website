const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Retrieve the location object from localStorage
const data = JSON.parse(localStorage.getItem(`location-${id}`));
console.log(data);

const tourSlider = document.querySelector('.tour-slider')
const tourContent = document.querySelector('.tour-content')
const tourHeading = document.querySelector('.tour-heading')
const tourHeadingContent = document.querySelector('.tour-heading-content')
const tourBanner = document.querySelector('.hero-inner')

tourHeading.textContent = data.title
tourHeadingContent.textContent = data.content
tourBanner.style.backgroundImage = `url(${data.tourBannerImgUrl})`;

const sliderItemHtml = data.tours.map((tour, index) => {
    return (
        `<div class="item tour-item" data-id=${index}>
            <a class="media-thumb" data-fancybox="gallery">
                <div class="media-text">
                    <h3>${tour.tourTitle}</h3>
                </div>
                <img
                    src=${tour.tourImgUrl}
                    alt="Image"
                    class="img-fluid"
                />
            </a>
        </div>`
    )
}).join('')

tourSlider.addEventListener('click', (e) => {
    const tourItem = e.target.closest('.tour-item');

    if (!tourItem) return
    const id = tourItem.dataset.id
    const tour = data.tours[id]
    tourContent.innerHTML = tour.tourContent
})

tourSlider.innerHTML = sliderItemHtml