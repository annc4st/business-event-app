import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const [ uploadStatus, setUploadStatus ] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    const handleUpload = async (event) => {
        event.preventDefault();
        if(!selectedFile) {
            console.log(selectedFile);
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploads/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(`File Uploaded successfully: ${response.data.filePath}`);

        } catch (error){
            setUploadStatus(`Upload failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Upload an Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
}


export default FileUpload;