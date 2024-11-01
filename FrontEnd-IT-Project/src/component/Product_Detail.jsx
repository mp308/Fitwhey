import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access the product ID from the URL
import axios from 'axios';
import { useUserAuth } from '../gobal/UserAuthContext';
import { FaCircleUser } from "react-icons/fa6";

function ProductDetail() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({});
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5); // State to hold the review rating
  const [comment, setComment] = useState(""); // State to hold the review comment
  const { user } = useUserAuth(); // Access logged-in user

  // Fetch product details and reviews by ID
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:8080/api/prod/products/${id}`);
        const reviewsResponse = await axios.get(`http://localhost:8080/api/v1/reviews/product/${id}`);

        if (productResponse.data) {
          setProduct(productResponse.data);
          console.log(reviewsResponse)
        } else {
          setError("Product not found");
        }

        if (reviewsResponse.data) {
          setReviews(reviewsResponse.data);
          calculateRatingSummary(reviewsResponse.data); // Calculate rating summary
        } else {
          setError("This product has no reviews");
        }
      } catch (error) {
        setError("Product or reviews not found");
      }
    };

    fetchProductAndReviews();
  }, [id]);

  // Calculate the summary of ratings (1 to 5 stars)
  const calculateRatingSummary = (reviews) => {
    const ratingCount = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    reviews.forEach(review => {
      ratingCount[review.Rating] = ratingCount[review.Rating] + 1;
    });
    const totalReviews = reviews.length;
    const averageRating = (reviews.reduce((acc, curr) => acc + curr.Rating, 0) / totalReviews).toFixed(1);

    setRatingSummary({
      ratingCount,
      totalReviews,
      averageRating,
    });
  };

  // Handle form submission for creating a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to submit a review.");
      return;
    }

    try {
      const reviewData = {
        product_id: id,
        UserID: user.id, // Assuming `user` object has an `id`
        Rating: rating,
        Comment: comment,
      };

      await axios.post(`http://localhost:8080/api/v1/reviews`, reviewData);

      // After successfully submitting, fetch updated reviews
      const updatedReviews = await axios.get(`http://localhost:8080/api/v1/reviews/product/${id}`);
      setReviews(updatedReviews.data);
      setComment(""); // Clear the comment after submission
      setRating(5); // Reset rating after submission

      // Show success alert
      window.alert("Review submitted successfully!");

    } catch (error) {
      setError("Failed to submit the review");
    }
  };

  // If there's an error (e.g., product or reviews not found), display the error message
  if (error) {
    return <div className="text-red-500 text-2xl p-8">{error}</div>;
  }

  // If product is still being fetched, show loading
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <img src={`http://localhost:8080${product.image_url}`} alt={product.name} className="w-64 h-64 object-cover" />
        <p className="text-lg mt-4">Price: {product.price} B</p>
        <p className="text-lg mt-4">Description: {product.description}</p>
        <p className="text-lg mt-4">Category: {product.category}</p>
      </div>

      {/* Display product ratings summary */}
      <div className="rating-summary container mx-auto mt-8">
        <h3 className="text-xl font-bold mb-4">Product Ratings</h3>
        <div className="flex items-center mb-4">
          <span className="text-4xl font-bold">{ratingSummary.averageRating} out of 5</span>
          <span className="ml-4 text-lg text-gray-600">({ratingSummary.totalReviews} reviews)</span>
        </div>
        {/* Display star breakdown */}
        <div className="flex flex-col mb-4">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2">
              <span className="text-lg font-bold">{star} Star</span>
              <div className="flex-1 mx-4 bg-gray-200 rounded h-3">
                <div
                  className="bg-yellow-400 h-3 rounded"
                  style={{
                    width: `${(ratingSummary.ratingCount[star] / ratingSummary.totalReviews) * 100}%`,
                  }}
                ></div>
              </div>
              <span>{ratingSummary.ratingCount[star]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Display product reviews */}
      <div className="reviews container mx-auto mt-8">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.ReviewID} className="mb-4 border-b pb-4">
              <div className="flex items-center mb-2">
                {review.user.healthInfo?.profile_image ? (
                  <img
                    src={`http://localhost:8080${review.user.healthInfo.profile_image}`}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                ) : (
                  <FaCircleUser className="w-10 h-10 text-red-600 mr-2" /> // Render the icon when profile_image is null
                )}

                <p className="font-bold">{review.user.UserName}</p>
                <p className="ml-2 text-gray-500 text-sm">{new Date(review.CreatedAt).toLocaleDateString()}</p>
              </div>
              <p className="font-bold">Rating: {review.Rating} / 5</p>
              <p>{review.Comment || "No comment"}</p>
              {review.media && (
                <div className="review-media mt-4">
                  {review.media.map((mediaItem, index) => (
                    <img key={index} src={`http://localhost:8080${mediaItem}`} alt="Review media" className="w-16 h-16 object-cover mr-2" />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
      </div>

      {/* Review submission form */}
      {user && (
        <div className="review-form container mx-auto mt-8">
          <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-lg font-bold mb-2">Rating</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border rounded p-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-lg font-bold mb-2">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded p-2"
                rows="4"
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Review</button>
          </form>
        </div>
      )}
    </>
  );
}

export default ProductDetail;
