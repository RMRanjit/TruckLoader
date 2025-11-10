import React from 'react';
import Scene from './components/Scene';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import Statistics from './components/Statistics';
import LoadedPackages from './components/LoadedPackages';
import ControlsHelp from './components/ControlsHelp';
import './App.css';

function App() {
  return (
    <div className="app">
      <Toolbar />
      <div className="app-content">
        <Sidebar />
        <div className="main-view">
          <Scene />
          <ControlsHelp />
        </div>
        <div className="right-panel">
          <LoadedPackages />
          <InfoPanel />
          <Statistics />
        </div>
      </div>
    </div>
  );
}

export default App;
