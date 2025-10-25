import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Dashboard } from './pages/Dashboard';
import { WeatherDetail } from './pages/WeatherDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { auth0Config } from './config/auth0';

function App() {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
    >
      <Router>
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
      </Router>
    </Auth0Provider>
  );
}

export default App;
