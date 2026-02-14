import React, { useState } from 'react';
import axios from 'axios';
import '../common/Auth.css';

const Complaint = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    comment: '',
    attachments: [] 
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAttachment = () => {
    setFormData({
        ...formData,
        attachments: [...formData.attachments, { file: null, name: '', id: Date.now() }]
    });
  };

  const handleRemoveAttachment = (id) => {
      setFormData({
          ...formData,
          attachments: formData.attachments.filter(att => att.id !== id)
      });
  };

  const handleAttachmentFileChange = (id, file) => {
      setFormData({
          ...formData,
          attachments: formData.attachments.map(att => 
              att.id === id ? { ...att, file: file } : att
          )
      });
  };

  const handleAttachmentNameChange = (id, name) => {
      setFormData({
          ...formData,
          attachments: formData.attachments.map(att => 
              att.id === id ? { ...att, name: name } : att
          )
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pincode', formData.pincode);
      data.append('comment', formData.comment);
      data.append('userId', user.id);
      data.append('status', 'Pending');
      
      if (formData.attachments && formData.attachments.length > 0) {
          formData.attachments.forEach(att => {
              if (att.file) {
                  data.append('attachments', att.file);
                  data.append('attachmentNames', att.name || att.file.name);
              }
          });
      }

      await axios.post('http://localhost:5000/api/complaints', 
        data,
        { 
            headers: { 
                Authorization: `Bearer ${token}`
            } 
        }
      );
      setMessage('Complaint registered successfully!');
      
      // Reset form but keep name
      setFormData({ 
        name: '', 
        address: '', 
        city: '', 
        state: '', 
        pincode: '', 
        comment: '',
        attachments: []
      });

      // Redirect to status tab after a short delay
      if (onSuccess) {
        setTimeout(() => {
            onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register complaint.');
    }
  };

  const labelStyle = {
    color: '#34495e',
    fontWeight: '500',
    marginBottom: '0.5rem',
    display: 'block',
    fontSize: '0.95rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '1px solid #ced6e0',
    borderRadius: '6px',
    fontSize: '0.95rem',
    backgroundColor: '#f8f9fa',
    color: '#2d3436',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: 'none'
  };

  const focusStyle = {
    borderColor: '#3498db',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
  };

  return (
    <div style={{maxWidth: '100%', margin: '0 auto'}}>
       {message && <div className="success-message" style={{marginBottom: '1rem', padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', border: '1px solid #c3e6cb'}}>{message}</div>}
       {error && <div className="error-message" style={{marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', border: '1px solid #f5c6cb'}}>{error}</div>}

       <form onSubmit={handleSubmit} className="auth-form" style={{ boxShadow: 'none', padding: 0 }}>
         <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
           <div className="form-group">
            <label style={labelStyle}>Product Name</label>
            <input 
               name="name" 
               value={formData.name} 
               onChange={handleChange} 
               required 
               style={inputStyle}
               placeholder="Enter product name"
               onFocus={(e) => {
                   Object.assign(e.target.style, focusStyle);
               }}
               onBlur={(e) => {
                   e.target.style.borderColor = '#dfe6e9';
                   e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
               }}
            />
          </div>
           <div className="form-group">
             <label style={labelStyle}>Address</label>
             <input 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                placeholder="House No, Street Area"
                onFocus={(e) => {
                    Object.assign(e.target.style, focusStyle);
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#dfe6e9';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
             />
           </div>
           <div className="form-group">
             <label style={labelStyle}>City</label>
             <input 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={(e) => {
                    Object.assign(e.target.style, focusStyle);
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#dfe6e9';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
             />
           </div>
           <div className="form-group">
             <label style={labelStyle}>State</label>
             <input 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                onFocus={(e) => {
                    Object.assign(e.target.style, focusStyle);
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#dfe6e9';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
             />
           </div>
            <div className="form-group">
             <label style={labelStyle}>Pincode</label>
             <input 
                name="pincode" 
                value={formData.pincode} 
                onChange={handleChange} 
                required 
                style={inputStyle}
                maxLength="6"
                onFocus={(e) => {
                    Object.assign(e.target.style, focusStyle);
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#dfe6e9';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                }}
             />
           </div>
         </div>
         
         <div className="form-group" style={{marginTop: '2rem'}}>
           <label style={labelStyle}>Description of Complaint</label>
           <textarea 
             name="comment" 
             value={formData.comment} 
             onChange={handleChange} 
             required 
             rows="5"
             placeholder="Please describe your issue in detail..."
             style={{
                ...inputStyle,
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '120px'
             }}
             onFocus={(e) => {
                Object.assign(e.target.style, focusStyle);
            }}
            onBlur={(e) => {
                e.target.style.borderColor = '#dfe6e9';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
            }}
           />
         </div>

         <div className="form-group" style={{marginTop: '1.5rem'}}>
            <label style={labelStyle}>Attachments (Optional)</label>
            
            {formData.attachments.map((att) => (
                <div key={att.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input 
                            type="text"
                            placeholder="Document Name (e.g. Invoice, Photo)"
                            value={att.name}
                            onChange={(e) => handleAttachmentNameChange(att.id, e.target.value)}
                            style={{ ...inputStyle, marginBottom: '0.5rem' }}
                        />
                        <input 
                            type="file"
                            onChange={(e) => handleAttachmentFileChange(att.id, e.target.files[0])}
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            style={{
                                ...inputStyle,
                                padding: '0.4rem',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={() => handleRemoveAttachment(att.id)}
                        style={{
                            padding: '0.6rem 1rem',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginTop: '2px'
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}

            <button 
                type="button"
                onClick={handleAddAttachment}
                style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
                + Add Attachment
            </button>
            
            <small style={{ color: '#7f8c8d', fontSize: '0.8rem', marginTop: '0.8rem', display: 'block' }}>
                Supported formats: JPG, PNG, PDF, DOC. Max size: 5MB per file.
            </small>
         </div>
         
         <div style={{marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end'}}>
            <button 
                type="submit" 
                className="submit-button" 
                style={{ 
                    width: 'auto', 
                    padding: '1rem 3rem',
                    backgroundColor: '#3498db',
                    backgroundImage: 'linear-gradient(to right, #3498db, #2980b9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
                }}
            >
                Register Complaint
            </button>
         </div>
       </form>
    </div>
  );
};

export default Complaint;
