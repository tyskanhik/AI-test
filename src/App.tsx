import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import './App.css';
import { UploadPage } from './pages/UploadPage/UploadPage';
import { SurveyPage } from './pages/SurveyPage/SurveyPage';
import { ReportStatusPage } from './pages/ReportStatusPage/ReportStatusPage';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/upload' element={<UploadPage />} />
        <Route path='/survey' element={<SurveyPage />} />
        <Route path='/report-status' element={<ReportStatusPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;