import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SurveyShell } from './components/SurveyShell';
import { SurveyPage } from './pages/SurveyPage';
import { ResultPage } from './pages/ResultPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <BrowserRouter basename="/survey">
      <Routes>
        <Route path="/" element={<SurveyShell><SurveyPage /></SurveyShell>} />
        <Route path="/result/:id" element={<SurveyShell><ResultPage /></SurveyShell>} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
