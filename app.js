
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.YELP_API_KEY;
const restaurantIds = ['02231934-2604-0066-2000-570459f04879']; // More restaurants can be added according to needs 
const getRestaurantReviews = async (restaurantId) => {
  try {
    const response = await axios.get(`https://api.yelp.com/v3/businesses/${restaurantId}/reviews`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const reviews = response.data.reviews;
    return reviews.map((review) => ({
      reviewerName: review.user.name,
      rating: review.rating,
      reviewText: review.text,
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

const summarizeReviews = async () => {
  for (const restaurantId of restaurantIds) {
    const reviews = await getRestaurantReviews(restaurantId);
    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      console.log(`Restaurant ID: ${restaurantId}`);
      console.log(`Average Rating: ${averageRating.toFixed(2)}`);
      console.log('Reviews:');
      reviews.forEach((review) => {
        console.log(`- Reviewer: ${review.reviewerName}, Rating: ${review.rating}`);
        console.log(`  Review: ${review.reviewText}`);
      });
      console.log('------------------------');
    } else {
      console.log(`No reviews found for Restaurant ID: ${restaurantId}`);
    }
  }
};

summarizeReviews();
