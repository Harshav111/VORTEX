import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
    const [view, setView] = useState('landing'); // 'landing' or 'dashboard'
    const [analysisData, setAnalysisData] = useState(null);

    const handleAnalysisComplete = (data) => {
        setAnalysisData(data);
        setView('dashboard');
    };

    return (
        <div className="app-container">
            {view === 'landing' ? (
                <LandingPage onUploadComplete={handleAnalysisComplete} />
            ) : (
                <Dashboard data={analysisData} onReset={() => setView('landing')} />
            )}
        </div>
    );
}

export default App;
