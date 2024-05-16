const apiKey = 'AIzaSyDPEBHU_sCUeKz6ZIuMRRNjgi_x_7YFZ48';
const placeId = 'ChIJUarf7WLRCDkRbn6R4O1ZN7U';

// const url = 'http://localhost:3001/place-details';
const url = 'https://express-proxy-jcby.onrender.com/place-details';

const fetchReviews = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.result) {
            const reviews = data.result.reviews || [];
            reviews.forEach(review => {
                console.log(`Author: ${review.author_name}, Rating: ${review.rating}, Review: ${review.text}`);
            });
        } else {
            console.log('No results found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchReviews();