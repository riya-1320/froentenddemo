import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios'; // Make sure axios is imported for API calls
import './quotation.css';

const Home = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; // Number of items per page
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Fetch Quotations API
  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get(
        '/api/components/combined/getAllFurniture-Detail',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token, // Pass the token in the headers
          },
        }
      );
      setQuotations(response.data); // Set the fetched quotations
      setLoading(false); // Set loading to false after data is loaded
    } catch (error) {
      if(error.response && error.response.status === 401) {
        navigate('/');
      }
      console.error('Error fetching quotations:', error);
      setLoading(false); // Set loading to false even if there is an error
    }
  };

  // useEffect to call fetchQuotations when the component mounts
  useEffect(() => {
    fetchQuotations();
  }, []);

  // Pagination calculations
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotations = quotations.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(quotations.length / itemsPerPage);

  const handleViewClick = (id) => {
    navigate(`/Dashboard/viewQuotation/${id}`);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Update current page
  };

  return (
    <div className="qh-home-container">
      <h1 className="qh-home-title">Quotations</h1>
      {loading ? (
       <div className='loader'>
        <Puff 
        height="100"
        width="100"
        radius={1}
        color="#FF1B47"
        ariaLabel="puff-loading"
        wrapperClass="usqu-loader"
        visible={true}
        />
        </div>
      ) : (
        <div className="qh-table-container">
          {quotations.length === 0 ? (
            <p className="qh-no-quotations">No quotations available.</p>
          ) : (
            <>
            <div className="qh-quotation-table-container">
            <table className="qh-quotation-table">
                <thead>
                  <tr>
                    <th>Qu. No</th>
                    <th>Client Name</th>
                    <th>Client Code</th>
                    <th>Submitted At</th>
                    <th>Total Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuotations.map((quotation, index) => (
                    <tr key={quotation._id} className="qh-quotation-row">
                      <td>{`Qu-${currentYear}-${String(index + 1 + currentPage * itemsPerPage).padStart(3, '0')}`}</td>
                      <td>{quotation.clientName}</td>
                      <td>{quotation.clientCode}</td>
                      <td>{new Date(quotation.submittedAt).toLocaleDateString()}</td>
                      <td>
                        {quotation.items.reduce((total, item) => total + item.totalAmount, 0)}
                      </td>
                      <td>
                        <button className="qh-view-button" onClick={() => handleViewClick(quotation._id)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Conditionally show pagination if data exceeds itemsPerPage */}
            <div>
            {quotations.length > itemsPerPage && (
                <ReactPaginate
                  previousLabel={'Previous'}
                  nextLabel={'Next'}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={'qh-pagination-container'}
                  pageClassName={'qh-pagination-page'}
                  previousClassName={'qh-pagination-prev'}
                  nextClassName={'qh-pagination-next'}
                  activeClassName={'qh-active-page'}
                  disabledClassName={'qh-disabled'}
                />
              )}
            </div>
            </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
