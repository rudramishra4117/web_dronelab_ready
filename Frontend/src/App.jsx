import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { LandingPage } from "./pages/LandingPage"
import { AuthPage } from "./pages/AuthPage"
import { MainPage } from "./pages/MainPage"
import { ContactPage } from "./pages/ContactPage"
import { BootcampPage } from "./pages/BootcampPage"
import { OAuthCallback } from "./pages/OAuthCallback"
import { PocPage } from "./pages/PocPage"
import { SimulationPage } from "./pages/SimulationPage"
import { TourPage } from "./pages/TourPage"
import { ToolboxPage } from "./pages/ToolboxPage"
import { ResourcesPage } from "./pages/ResourcesPage"
import { FacultyPage } from "./pages/FacultyPage"
import { ToggleTheme } from "./components/ui/toggle-theme"

const ExternalRedirect = ({ to }) => {
  window.location.href = to;
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/bootcamp" element={<BootcampPage />} />
        <Route path="/services/try-3d-cad" element={<ExternalRedirect to="/cad/" />} />
        <Route path="/poc/:id" element={<PocPage />} />
        <Route path="/services/simulation" element={<SimulationPage />} />
        <Route path="/services/toolbox" element={<ToolboxPage />} />
        <Route path="/about/tour" element={<TourPage />} />
        <Route path="/about/faculty" element={<FacultyPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <div className="fixed bottom-6 right-6 z-50 p-2 bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border/50">
        <ToggleTheme animationType="circle-spread" />
      </div>
    </AuthProvider>
  )
}

export default App
