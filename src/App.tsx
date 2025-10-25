import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './Auth0Navigator';
import { Dashboard } from './pages/Dashboard';
import { WeatherDetail } from './pages/WeatherDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Auth0ProviderWithNavigate>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather/:cityId"
            element={
              <ProtectedRoute>
                <WeatherDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Auth0ProviderWithNavigate>
    </Router>
  );
}

export default App;
