import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const reviewsPerPage = 10; // Set the number of reviews per page

  // Fetch all reviews from the API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/reviews');
        setReviews(response.data);
      } catch (error) {
        setError("Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, []);

  // Delete a review by ID
  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/reviews/${id}`);
      setReviews(reviews.filter(review => review.ReviewID !== id)); // Remove the deleted review from the state
    } catch (error) {
      setError("Failed to delete the review");
    }
  };

  // Edit a review (set in edit mode)
  const startEditing = (review) => {
    setEditingReview(review.ReviewID);
    setNewComment(review.Comment); // Set the current comment in the edit input
  };

  // Update a review
  const updateReview = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/reviews/${id}`, { Comment: newComment });
      setReviews(reviews.map(review => review.ReviewID === id ? { ...review, Comment: newComment } : review));
      setEditingReview(null); // Exit edit mode
    } catch (error) {
      setError("Failed to update the review");
    }
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Review Manager</h2>

      {error && <div className="text-red-500">{error}</div>}

      {currentReviews.length > 0 ? (
        <>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Comment</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review.ReviewID}>
                  <td className="border px-4 py-2">User {review.UserID}</td>
                  <td  className="border px-4 py-2">Product {review.product_id}</td>
                  <td className="border px-4 py-2">{review.Rating}</td>
                  <td className="border px-4 py-2">
                    {editingReview === review.ReviewID ? (
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      review.Comment
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingReview === review.ReviewID ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => updateReview(review.ReviewID)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                          onClick={() => setEditingReview(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => startEditing(review)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => deleteReview(review.ReviewID)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}

export default ReviewManager;
