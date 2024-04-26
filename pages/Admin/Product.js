/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, Productef, useRef } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";
const db = firebase.firestore();
const Product = () => {
  const router = useRouter(); 

  const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const isAdminInLocalStorage = localStorage.getItem("isAdmin") === "true";
//     setIsAdmin(isAdminInLocalStorage);
//     if (!isAdminInLocalStorage) {
//       router.push("/Admin/adminlogin");
//     } else {
//     }
//   }, [router]);

  const [Productdata, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    frontImage: "",
    MemberType: "",
  });

  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "frontImage") {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const db = firebase.firestore();
      const storage = firebase.storage();

      let frontImageUrl = "";
      if (formData.frontImage) {
        const frontImageFile = formData.frontImage;
        const storageRef = storage.ref();
        const frontImageRef = storageRef.child(frontImageFile.name);
        await frontImageRef.put(frontImageFile);
        frontImageUrl = await frontImageRef.getDownloadURL();
      }

      const dataToUpload = { ...formData, frontImage: frontImageUrl };
      await db.collection("Product").add(dataToUpload);
      toast.success("Data uploaded successfully!");
      router.reload();
    } catch (error) {
      console.error("Error uploading data: ", error);
      toast.error("Error uploading data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // New state to manage pop-up visibility and selected Product's data
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      const db = firebase.firestore();
      const ProductsRef = db.collection("Product");

      ProductsRef.get()
        .then((querySnapshot) => {
          const Productdata = [];
          querySnapshot.forEach((doc) => {
            Productdata.push({ ...doc.data(), id: doc.id });
          });

          setProductData(Productdata);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
          setIsLoading(false);
        });
    });

    return () => unsubscribe();
  }, [router]);

  // Function to handle showing E details
  const handleEditDetails = (Product) => {
    setSelectedProduct(Product);
    setEditedProduct({ ...Product });
    setShowPopup(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDeleteImage = async () => {
    try {
      const storage = firebase.storage();
      const imageRef = storage.refFromURL(editedProduct.frontImage);
      await imageRef.delete();
      setEditedProduct({ ...editedProduct, frontImage: "" });
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error("Error deleting image. Please try again.");
    }
  };

  const handleReplaceImage = async (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const frontImageFile = files[0];
    const frontImageRef = storageRef.child(frontImageFile.name);

    try {
      await frontImageRef.put(frontImageFile);
      const frontImageUrl = await frontImageRef.getDownloadURL();
      setEditedProduct({ ...editedProduct, frontImage: frontImageUrl });
      toast.success("New image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading new image: ", error);
      toast.error("Error uploading new image. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editedProduct) {
        const db = firebase.firestore();
        const ProductRef = db.collection("Product").doc(editedProduct.id);
        await ProductRef.update({
          name: editedProduct.name,
          price: editedProduct.price,
          category: editedProduct.category,
          description: editedProduct.description,
          frontImage: editedProduct.frontImage,
          MemberType: editedProduct.MemberType,
        });
        setShowPopup(false);
        setEditedProduct(null);
        toast.success("Changes saved successfully!");
        router.reload();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred while saving changes.");
    }
  };

  // Function to handle closing the pop-up
  const handleClosePopup = () => {
    setSelectedProduct(null);
    setShowPopup(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = Productdata.slice(startIndex, endIndex);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(Productdata.length / itemsPerPage);

  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("Product").doc(id).delete();
      const updatedData = Productdata.filter((item) => item.id !== id);
      setProductData(updatedData);
      toast.success("Deletion successful!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Deletion failed. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };


  const [selectedProductReviews, setSelectedProductReviews] = useState([]);
  const [selectedEditedId, setSelectedEditedId] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // ... (previous code remains unchanged)

// Function to handle showing reviews for a specific Product item
const handleShowReviews = async (selectedItemId) => {
  try {
    const ProductRef = db.collection("Product").doc(selectedItemId);
    const ProductDoc = await ProductRef.get();

    if (ProductDoc.exists) {
      const Productdata = ProductDoc.data();
      setSelectedProduct(Productdata);
      setSelectedEditedId(selectedItemId); // Set the ID of the selected item
      
      const reviewsRef = ProductRef.collection("reviews");
      const reviewsSnapshot = await reviewsRef.get();
      const reviewsData = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID
        ...doc.data(), // Include the rest of the review data
      }));
      setSelectedProductReviews(reviewsData);
      
      setShowReviewsModal(true);
    } else {
      console.error("No Product found with the provided ID");
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};




// Function to approve/disapprove reviews
// Function to approve/disapprove reviews
const handleReviewApproval = async (reviewId, newStatus, shouldDelete = false) => {
  try {
    if (!selectedEditedId) {
      throw new Error("No selected Product found");
    }

    const ProductRef = db.collection("Product").doc(selectedEditedId);
    const ProductDoc = await ProductRef.get();

    if (!ProductDoc.exists) {
      throw new Error("No selected Product found");
    }

    const reviewRef = ProductRef.collection("reviews").doc(reviewId);

    if (shouldDelete) {
      await reviewRef.delete();
      const updatedReviews = selectedProductReviews.filter(
        (review) => review.id !== reviewId
      );
      setSelectedProductReviews(updatedReviews);
      toast.success(`Review deleted successfully!`);
    } else {
      const prevStatus = selectedProductReviews.find(
        (review) => review.id === reviewId
      ).approved;

      await reviewRef.update({ approved: newStatus });

      // Update the selectedProductReviews state
      const updatedReviews = selectedProductReviews.map((review) =>
        review.id === reviewId ? { ...review, approved: newStatus } : review
      );

      setSelectedProductReviews(updatedReviews);

      // Show toast message when the approval status changes
      toast.success(`Review ${prevStatus} changed to ${newStatus} successfully!`);
    }
  } catch (error) {
    console.error("Error approving/disapproving review:", error);
    toast.error("Failed to update review status. Please try again.");
  }
};






// ... (rest of your code remains unchanged)




  return (
    <div className="m-auto min-h-screen bg-white dark:bg-gray-900">
      <AdminNavbar/>
      <section className="bg-white lg:ml-64  dark:bg-gray-900">
      <h1 className="text-xl text-red-600 text-center font-bold" >Our Products</h1>
        <div className="container px-6 py-10 mx-auto">
          {showAllInputFormats ? (
            <div>
              <form
                onSubmit={handleFormSubmit}
                className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
              
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-black text-sm font-bold mb-2"
                      htmlFor="frontImage"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      name="frontImage"
                      onChange={handleFileChange}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      value={formData.name}
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      placeholder="Enter price"
                      onChange={handleInputChanges}
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                 
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
               
                <div>
  <select
    name="MemberType"
    value={formData.MemberType}
    onChange={handleInputChanges}
    required
    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="">Select MemberType Products</option>
    <option value="Gold">Gold</option>
    <option value="Diamond">Diamond</option>
  </select>
</div>

                  <div>
                    <input
                      type="text"
                      name="category"
                      placeholder="Enter category"
                      value={formData.category}
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                 
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleInputChanges}
                      required
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                      style={{ width: "100%", height: "150px" }}
                    ></textarea>
                  </div>
                </div>
                {/* Add similar grid layouts for the remaining input fields */}
                {/* ... */}
                <div className="flex items-center justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                  onClick={handleCloseAllInputFormats}
                  className="bg-red-500 hover:bg-red-700 ml-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Close Form
                </button>
                </div>
              </form>
            </div>
          ) : (
            // Display the add PG Detail button when isEditing is false and showAllInputFormats is false
            <button
              onClick={handleShowAllInputFormats}
              className="w-full p-2 bg-blue-500 text-white rounded-md"
            >
              Add Product
            </button>
          )}

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <h1>Loading</h1>
            ) : (
              Productdata.map((Product, idx) => (
                <div
                  key={Product.id}
                  className="max-w-sm rounded overflow-hidden shadow-lg m-4"
                >
                  <div className="px-6 py-4">
                    <img
                      className="w-full h-40 object-cover"
                      src={Product.frontImage}
                      alt={Product.name}
                    />
                    <div className="font-bold text-xl mb-2">
                      {Product.name}
                    </div>
                    <p className="text-black text-base">
                       Price: {Product.price}
                    </p>
                
                    <p className="text-black text-xs">{Product.category}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleDelete(Product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
                      >
                        Delete
                      </button>
                      {/* You can add an edit functionality or link to an edit page */}
                      {/* <Link href={`/edit/${Product.id}`}> */}
                      {/*   <a className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none">Edit</a> */}
                      {/* </Link> */}
                      <button
                        onClick={() => handleEditDetails(Product)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
  className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
  onClick={() => handleShowReviews(Product.id)}
>
  ({selectedProductReviews.filter(review => review.approved === 'Pending').length} Pending Review ) Reviews
</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {/* Back Button */}
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === 1 ? "bg-red-400 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="inline-block mr-1" /> Previous
              </button>

              {/* Page Buttons */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePaginationClick(index + 1)}
                  className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                    currentPage === index + 1 ? "bg-red-400" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePaginationClick(currentPage + 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-red-300 rounded-md ${
                  currentPage === totalPages
                    ? "bg-red-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight className="inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>



      {showReviewsModal && (
  <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <span className="close text-gray-500 cursor-pointer" onClick={() => setShowReviewsModal(false)}>
          &times;
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Message</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
          {selectedProductReviews.map((review) => (
  <tr key={review.id}>
    <td className="border border-gray-300 px-4 py-2">{review.userName}</td>
    <td className="border border-gray-300 px-4 py-2">{review.message}</td>
    <td className="border border-gray-300 px-4 py-2">
      {review.timestamp &&
        new Date(review.timestamp.toDate()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
    </td>
   

    <td className="border border-gray-300 px-4 py-2">
  <button
    className={`text-white rounded-lg px-3 py-1 text-center font-bold whitespace-no-wrap ${
      review.approved === "Active" ? "bg-green-500" : "bg-red-500"
    }`}
    onClick={() => {
      const newStatus =
        review.approved === "Active" ? "Pending" : "Active";
      handleReviewApproval(review.id, newStatus);
    }}
  >
    {review.approved === "Active" ? "Active" : "Pending"}
  </button>
  <button
    className="bg-red-500 ml-2 text-white px-3 py-1 rounded-md text-xs focus:outline-none"
    onClick={() => handleReviewApproval(review.id, null, true)}
  >
    Delete
  </button>
</td>


  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

      {/* Render pop-up if showPopup is true */}
      {showPopup && selectedProduct && (
        <div className="fixed   overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg mt-80">
            {editedProduct.frontImage && (
              <div>
                <img
                  className="w-32 h-32 object-cover mb-4"
                  src={editedProduct.frontImage}
                  alt={editedProduct.name}
                />
                <button
                  onClick={handleDeleteImage}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Delete Image
                </button>
              </div>
            )}

            {/* Input to upload a new image */}
            <div>
              <label className="block text-sm font-medium text-black">
                Upload New Image
              </label>
              <input
                type="file"
                onChange={handleReplaceImage}
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedProduct.name}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-black"
                  >
                    Product Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={editedProduct.price}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        price: e.target.value,
                      })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-black"
                  >
                    category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={editedProduct.category}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        category: e.target.value,
                      })
                    }
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
         
                <div>
  <label htmlFor="MemberType" className="block text-sm font-medium text-black">
   MemberType Product
  </label>
  <select
    id="MemberType"
    name="MemberType"
    value={editedProduct.MemberType}
    onChange={(e) =>
      setEditedProduct({
        ...editedProduct,
        MemberType: e.target.value,
      })
    }
    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  >
    <option value="">Select MemberType Products</option>
    <option value="Gold">Gold</option>
    <option value="Diamond">Diamond</option>
  </select>
</div>

                
                {/* Add more fields here for editing */}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-black"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={editedProduct.description}
                    onChange={(e) =>
                      setEditedProduct({
                        ...editedProduct,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 h-32 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {/* Add more fields here for editing */}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Product;
