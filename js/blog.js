const sliders = document.querySelectorAll('.slider');
const readMoreBtns = document.querySelectorAll('.read-more-button');

let currentIndex = 0;
let intervalId;

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
    console.log('start');
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
        const blogContent = btn.closest('.travel-experts-container').querySelector('.blog-content');
        blogContent.classList.toggle('show');
    })
})