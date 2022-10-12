import React from 'react';
import FileUpload from './components/FileUpload';
import { AiFillFileWord} from "react-icons/ai";
import './App.css';
const App = () => (
  <main className='container-fluid'>
    <header>
        <AiFillFileWord style={{width: "50px",height: "50px"}}/> <h1>Word to Pdf Converter</h1>
    </header>
    <FileUpload />
    <footer></footer>
  </main>
);

export default App;
