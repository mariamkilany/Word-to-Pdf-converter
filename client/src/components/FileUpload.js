import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose docx File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    console.log(filename.split('.')[1])
    if(filename.split('.')[1]==='docx'){
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        }
      });
      
      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });
      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0)
    }
  }
  else if(filename.split('.')[1]===undefined){
    setMessage('Please choose file..')
  }
  else{
    setMessage('only upload docx files !!!')
  }
  };

  return (
    <section>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='col-md-6 input-control'>
          <label className='mb-4 h2' htmlFor='customFile'>
            {filename}
          </label>
          <input
            type='file'
            className='form-control form-control-lg'
            id='customFile'
            onChange={onChange}
          />
          <input
          type='submit'
          value='Upload'
          className='btn'
        />
        </div>
      </form>
      <Progress percentage={uploadPercentage} />
          {uploadedFile.fileName ? <div className='row mt-5'>
            <div className="col-md-6 m-auto uploaded">
                <h3 className='text-center'>
                    {uploadedFile.fileName.split('.')[0]+'.pdf'}
                </h3>
                <button className='btn'><a href={uploadedFile.filePath} download>Download</a></button>
            </div>
        </div>
        :
        null}
    </section>
  );
};

export default FileUpload;
