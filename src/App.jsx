import { Databases } from 'appwrite'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Room from './pages/Room'
import LoginPage from './pages/LoginPage';
import 'remixicon/fonts/remixicon.css'
import PrivateRoutes from './components/ui/Routes/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import RegisterForm from './pages/RegisterForm';

function App() {
  

  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterForm/>} />
        <Route element={<PrivateRoutes/>}>
        <Route path="/" element={<Room />} />
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
