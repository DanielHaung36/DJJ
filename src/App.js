import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './compoents/pdform';
import Quixote from './compoents/genneratepdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
window.Buffer = window.Buffer || require("buffer").Buffer;
function App() {
  return (
    <div className="App">
     <Form/>
    </div>
  );
}

export default App;
