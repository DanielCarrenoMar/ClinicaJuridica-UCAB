import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Navigate, Route } from "react-router";
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
import LateralMenuLayer from '#layers/LateralMenuLayer.tsx';
import CaseInfo from '#pages/CaseInfo.tsx';
import ApplicantInfo from '#pages/ApplicantInfo.tsx';
import Login from '#pages/Login.tsx';
import ErrorPage from '#pages/ErrorPage.tsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '#components/ProtectedRoute.tsx';
import UserInfo from '#pages/infoUser/UserInfo.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute requiredLevel={3} redirectPath="/login" />}>
        <Route element={<LateralMenuLayer />}>
          <Route index element={<DashBoard />} />
          <Route path="/crearCaso/*" element={<CreateCase />}>
            <Route index element={<Navigate to="solicitante" replace />} />
            <Route path="solicitante" element={<CreateCaseApplicantStep />} />
            <Route path="caso" element={<CreateCaseCaseStep />} />
          </Route>
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/acciones" element={<ActionsHistory />} />
          <Route path="/reportes" element={<Reports />} />

          <Route element={<ProtectedRoute requiredLevel={2} />}>
            <Route path="/usuarios" element={<Users />} />
            <Route path="/usuario/:userId" element={<UserInfo />} />
          </Route>

          <Route element={<ProtectedRoute requiredLevel={1} />}>
            <Route path="/semestres" element={<Semesters />} />
            <Route path="/nucleos" element={<Nuclei />} />
            <Route path="/configuracion" element={<Config />} />
          </Route>

          <Route path="/busqueda" element={<SearchCases />} />
          <Route path="/caso/:id" element={<CaseInfo />} />
          <Route path="/solicitante/:id" element={<ApplicantInfo />} />
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
