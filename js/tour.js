const tours = [
    {
        "id": 1,
        "title": "Trekking",
        "imgurl": "images/hero-slider-1.jpg",
        "description": "Trekking Experience the thrill of trekking through beautiful landscapes."
    },
    {
        "id": 2,
        "title": "Bungee jumping",
        "imgurl": "images/hero-slider-2.jpg",
        "description": "Bungee Feel the adrenaline rush with our safe and exciting bungee jumping activity."
    },
    {
        "id": 3,
        "title": "Boating",
        "imgurl": "images/hero-slider-3.jpg",
        "description": "Boating Enjoy a peaceful boating experience on the serene waters."
    },
    {
        "id": 4,
        "title": "Sky diving",
        "imgurl": "images/hero-slider-3.jpg",
        "description": "Sky Diving Enjoy a peaceful boating experience on the serene waters."
    }
]

function getTours() {
    return tours;
}

const tourSlider = document.querySelector('.tour-slider')
const tourContent = document.querySelector('.tour-content')

const sliderItemHtml = getTours().map(tour => {
    console.log(tour);
    return (
        `<div class="item tour-item" data-id=${tour.id}>
            <a class="media-thumb" data-fancybox="gallery">
                <div class="media-text">
                    <h3>${tour.title}</h3>
                </div>
                <img
                    src=${tour.imgurl}
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
    const tour = getTours().find(tour => tour.id === parseInt(id))
    tourContent.innerHTML = tour.description
})


tourSlider.innerHTML = sliderItemHtml