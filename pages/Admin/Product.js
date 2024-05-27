/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, Productef, useRef } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";
import { FiTrash2, FiEdit, FiStar } from "react-icons/fi"
import Select from "react-select";

const Members = [
  { value: 1, label: "SILVER MEMBER" },
  { value: 2, label: "GOLD MEMBER" },
  { value: 3, label: "DIAMOND MEMBER" },
];

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
    varient: "",
    description: "",
    MemberType: [],
    frontImage: "",
    zipfile: "",
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
  const handlezipFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "zipfile") {
      setFormData({ ...formData, [name]: files[0] });
    }
  };
  const handleSelectChange = (selectedOptions) => {
    setFormData({ ...formData, MemberType: selectedOptions });
  };

  
 

  const [selectedOptions, setSelectedOptions] = useState(null);

 

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
      let zipfileurl = "";
      if (formData.zipfile) {
        const frontImageFile = formData.zipfile;
        const storageRef = storage.ref();
        const frontImageRef = storageRef.child(frontImageFile.name);
        await frontImageRef.put(frontImageFile);
        zipfileurl = await frontImageRef.getDownloadURL();
      }

      const dataToUpload = { ...formData, frontImage: frontImageUrl, zipfile: zipfileurl };
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
console.log("editproduct",editedProduct)
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
  const handleEditSelectChange = (selectedOptions) => {
    setEditedProduct({ ...editedProduct, MemberType: selectedOptions });
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


  const handleDeleteZip = async () => {
    try {
      const storage = firebase.storage();
      const zipRef = storage.refFromURL(editedProduct.zipfile);
      await zipRef.delete();
      setEditedProduct({ ...editedProduct, zipfile: "" });
      toast.success("Zip File deleted successfully!");
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error("Error deleting image. Please try again.");
    }
  };

  const handleReplaceZip = async (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const frontZipFile = files[0];
    const frontZipRef = storageRef.child(frontZipFile.name);

    try {
      await frontZipRef.put(frontZipFile);
      const frontZipUrl = await frontZipRef.getDownloadURL();
      setEditedProduct({ ...editedProduct, zipfile: frontZipUrl });
      toast.success("New Zip File uploaded successfully!");
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
          varient: editedProduct.varient,
          category: editedProduct.category,
          description: editedProduct.description,
          frontImage: editedProduct.frontImage,
          zipfile: editedProduct.zipfile,
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
      toast.success("Deletion successful!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Deletion failed. Please try again.");
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
                  <div>
                    <label
                      className="block text-black text-sm font-bold mb-2"
                      htmlFor="zipfile"
                    >
                      Upload Zip File
                    </label>
                    <input
                      type="file"
                      name="zipfile"
                      onChange={handlezipFileChange}
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
    name="varient"
    value={formData.varient}
    onChange={handleInputChanges}
    required
    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="">Select Varient</option>
    <option value="Normal">Normal</option>
    <option value="Paidmod">Paidmod</option>
    <option value="Bundle">Bundle</option>
  </select>
</div>
<div className="px-2">
                    <Select
                      name="MemberType"
                      value={formData.MemberType}
                      onChange={handleSelectChange}
                      options={Members}
                      isMulti
                    />
                  </div>
                <div>
  <select
    name="category"
    value={formData.category}
    onChange={handleInputChanges}
    required
    className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="">Select Category</option>
    <option value="NONE">NONE</option>
    <option value="RECENTLY PRODUCTS">RECENTLY PRODUCTS</option>
    <option value="HOT MODS">HOT MODS</option>
    <option value="BEST SELLING MODS">BEST SELLING MODS</option>
    <option value="TOP RATED MODS">TOP RATED MODS</option>
  </select>
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
            <div className="flex justify-end mb-4">
            <button
              onClick={handleShowAllInputFormats}
              className="p-2 bg-gray-800 text-white rounded-md"
            >
             + Add Product
            </button>
          </div>
          
          )}


<div class="overflow-x-auto">
  <table class="min-w-full bg-white font-[sans-serif]">
    <thead class="bg-gray-100 whitespace-nowrap">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
          Product Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
          Price
        </th>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
        Varient
        </th>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
         Category
        </th>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
          Member
        </th>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="whitespace-nowrap">
    {isLoading ? (
              <h1>Loading</h1>
            ) : (
              Productdata.map((Product, idx) => (
      <tr key={idx}  class="hover:bg-gray-50">
        <td class="px-6 py-4 text-base">
          {Product.name}
        </td>
        <td class="px-6 py-4 text-base">
        {Product.price}
        </td>
        <td class="px-6 py-4 text-base">
        {Product.varient}
        </td>
        <td class="px-6 py-4 text-base">
        {Product.category}
        </td>
        <td class="px-6 py-4 text-xs">
        {Product.MemberType.map((member) => (
                    <span key={member.value}>{member.label}, </span>
                  ))}
        </td>
        <td class="px-6 py-4">
          <button   onClick={() => handleEditDetails(Product)} class="mr-4" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-blue-500 hover:fill-blue-700"
              viewBox="0 0 348.882 348.882">
              <path
                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                data-original="#000000" />
              <path
                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                data-original="#000000" />
            </svg>
          </button>
          <button     onClick={() => handleDelete(Product.id)} class="mr-4" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
              <path
                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                data-original="#000000" />
              <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                data-original="#000000" />
            </svg>
          </button>
        </td>
      </tr>

              )))}
    </tbody>
  </table>
</div>

        

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {/* Back Button */}
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-gray-700 rounded-md ${
                  currentPage === 1 ? "bg-gray-800 cursor-not-allowed" : ""
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
                  className={`px-4 py-2 text-sm text-white font-medium bg-gray-700 rounded-md ${
                    currentPage === index + 1 ? "bg-gray-800" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePaginationClick(currentPage + 1)}
                className={`px-4 py-2 text-sm text-white font-medium bg-gray-700 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-800 cursor-not-allowed"
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
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md mr-2"
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
            {/* {editedProduct.zipfile && (
              <div>
               
                <button
                  onClick={handleDeleteZip}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md mr-2"
                >
                  Delete File
                </button>
              </div>
            )} */}

            {/* Input to upload a new image */}
            <div>
              <label className="block text-sm font-medium text-black">
                Update New Zip File
              </label>
              <input
                type="file"
                onChange={handleReplaceZip}
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
  <label htmlFor="varient" className="block text-sm font-medium text-black">
   MemberType Product
  </label>
  <select
    id="varient"
    name="varient"
    value={editedProduct.varient}
    onChange={(e) =>
      setEditedProduct({
        ...editedProduct,
        varient: e.target.value,
      })
    }
    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
  >
 <option value="">Select Varient</option>
    <option value="Normal">Normal</option>
    <option value="Paidmod">Paidmod</option>
    <option value="Bundle">Bundle</option>
  </select>
</div>
                <div>
                <Select
                      name="MemberType"
                      value={editedProduct.MemberType}
                      onChange={handleEditSelectChange}
                      options={Members}
                      isMulti
                    />
</div>
                <div>
  <label htmlFor="category" className="block text-sm font-medium text-black">
  Category
  </label>
  <select
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
  >
    <option value="">Select Category</option>
    <option value="NONE">NONE</option>
    <option value="RECENTLY PRODUCTS">RECENTLY PRODUCTS</option>
    <option value="HOT MODS">HOT MODS</option>
    <option value="BEST SELLING MODS">BEST SELLING MODS</option>
    <option value="TOP RATED MODS">TOP RATED MODS</option>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md mr-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md"
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
