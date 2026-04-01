import { useState } from 'react';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import LiveSimulation from './components/LiveSimulation';
import type { EmailData, AnalysisResult } from './types';
import { analyzeEmails } from './utils/phishingDetector';
import './App.css';

type TabType = 'home' | 'upload' | 'dashboard' | 'analysis';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [emailData, setEmailData] = useState<EmailData[] | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleDataLoaded = (emails: EmailData[]) => {
    setEmailData(emails);
    const analysisResult = analyzeEmails(emails);
    setAnalysis(analysisResult);
    setActiveTab('dashboard');
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  return (
    <Layout>
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasData={emailData !== null}
      />

      <div className="content-area">
        {activeTab === 'home' && (
          <Home onGetStarted={() => setActiveTab('upload')} />
        )}

        {activeTab === 'upload' && (
          <Upload onDataLoaded={handleDataLoaded} />
        )}

        {activeTab === 'dashboard' && analysis && (
          <Dashboard analysis={analysis} />
        )}

        {activeTab === 'analysis' && analysis && emailData && (
          <Analysis
            analysis={analysis}
            onStartSimulation={handleStartSimulation}
            isSimulating={isSimulating}
          />
        )}
      </div>

      {isSimulating && emailData && (
        <LiveSimulation
          baseEmails={emailData}
          onStop={handleStopSimulation}
        />
      )}
    </Layout>
  );
}

export default App;
