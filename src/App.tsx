import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/routes/Login';
import Dashboard from '@/routes/Dashboard';
import Editor from '@/routes/Editor';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/editor/:id" element={<Editor />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
