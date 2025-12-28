import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import './index.css'
import DashBoard from '#pages/DashBoard.tsx';
import CreateCase from '#pages/CreateCase.tsx';
import CreateCaseApplicantStep from '#pages/CreateCaseApplicantStep.tsx';
import CreateCaseCaseStep from '#pages/CreateCaseCaseStep.tsx';
import Calendar from '#pages/Calendar.tsx';
import ActionsHistory from '#pages/ActionsHistory.tsx';
import Reports from '#pages/Reports.tsx';
import Users from '#pages/Users.tsx';
import Semesters from '#pages/Semesters.tsx';
import Nuclei from '#pages/Nuclei.tsx';
import Config from '#pages/Config.tsx';
import SearchCases from '#pages/SearchCases.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/crearCaso/*" element={<CreateCase />}>
        <Route index element={<Navigate to="solicitante" replace />} />
        <Route path="solicitante" element={<CreateCaseApplicantStep />} />
        <Route path="caso" element={<CreateCaseCaseStep />} />
      </Route>
      <Route path="/calendario" element={<Calendar />} />
      <Route path="/acciones" element={<ActionsHistory />} />
      <Route path="/reportes" element={<Reports />} />
      <Route path="/usuarios" element={<Users />} />
      <Route path="/semestres" element={<Semesters />} />
      <Route path="/nucleos" element={<Nuclei />} />
      <Route path="/configuracion" element={<Config />} />
      <Route path="/busqueda" element={<SearchCases />} />
    </Routes>
  </BrowserRouter>
)
