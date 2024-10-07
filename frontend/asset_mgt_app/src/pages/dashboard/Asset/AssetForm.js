import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const AssetForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    Manufactured_date: '',
    cost: '',
    invoice: '',
    category: '',
    specification: '',
    model_number: '',
    image: null,
    issue_id: '',
    asset_status: 'A',
    depreciation: '',
    useful_life: '',
  });

  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  const [divisions, setDivisions] = useState([]);
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [errorDivisions, setErrorDivisions] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    axios.get(`${baseUrl}/divisions/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
      .then(response => {
        setDivisions(response.data);
        setLoadingDivisions(false);
      })
      .catch(error => {
        setErrorDivisions('Error fetching divisions');
        setLoadingDivisions(false);
      });

    const categoryChoices = [
      { value: 'COMP', label: 'Computer' },
      { value: 'LAPT', label: 'Laptop' },
      { value: 'SERV', label: 'Server' },
      { value: 'UPS', label: 'UPS' },
      { value: 'PROJ', label: 'Projector' },
      { value: 'ACP', label: 'Access Point' },
      { value: 'BMD', label: 'Biometric Device' },
      { value: 'PRIN', label: 'Printer' },
      { value: 'PHOTO', label: 'Photocopy Machine' },
      { value: 'MEZA', label: 'Meza' },
      { value: 'KAB', label: 'Kabati' },
      { value: 'KIT', label: 'Kiti' },
      { value: 'SOF', label: 'Sofa' },
      { value: 'OTHERS', label: 'Other Accessories' },
    ];
    const statusChoices = [
      { value: 'A', label: 'Active' },
      { value: 'B', label: 'Need Troubleshoot' },
      { value: 'C', label: 'Inactive' },
    ];

    setCategories(categoryChoices);
    setStatuses(statusChoices);
  }, [baseUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getAuthToken();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    axios.post(`${baseUrl}/assets/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        Swal.fire({
          title: 'Success!',
          text: 'Asset added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        setFormData({
          name: '',
          Manufactured_date: '',
          cost: '',
          invoice: '',
          category: '',
          specification: '',
          model_number: '',
          image: null,
          issue_id: '',
          asset_status: 'A',
          depreciation: '',
          useful_life: '',
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error adding the asset!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  return (
    <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="issue_id" className="form-label">Division (Issue)<span className="text-danger">*</span></label>
            <select
              className="form-select"
              id="issue_id"
              name="issue_id"
              value={formData.issue_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a division</option>
              {loadingDivisions ? (
                <option>Loading...</option>
              ) : (
                divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))
              )}
            </select>
            {errorDivisions && <p className="text-danger">{errorDivisions}</p>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="Manufactured_date" className="form-label">Manufactured Date<span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              id="Manufactured_date"
              name="Manufactured_date"
              value={formData.Manufactured_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="cost" className="form-label">Cost<span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="invoice" className="form-label">Invoice<span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              id="invoice"
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="model_number" className="form-label">Model Number</label>
            <input
              type="text"
              className="form-control"
              id="model_number"
              name="model_number"
              value={formData.model_number}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="specification" className="form-label">Specification</label>
            <input
              type="text"
              className="form-control"
              id="specification"
              name="specification"
              value={formData.specification}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="depreciation" className="form-label">Depreciation<span className="text-danger">*</span></label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="depreciation"
              name="depreciation"
              value={formData.depreciation}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="useful_life" className="form-label">Useful Life (Years)<span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              id="useful_life"
              name="useful_life"
              value={formData.useful_life}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="asset_status" className="form-label">Asset Status<span className="text-danger">*</span></label>
            <select
              className="form-select"
              id="asset_status"
              name="asset_status"
              value={formData.asset_status}
              onChange={handleChange}
              required
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleFileChange}
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">Add Asset</button>
        </div>
      </form>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AssetForm;
