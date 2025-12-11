import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './store/PortfolioContext';
import Layout from './components/Layout';
import Portfolio from './pages/Portfolio';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </PortfolioProvider>
  );
};

export default App;
