import React from 'react';
import AikyamHero from './components/AikyamHero';
import AikyamAbout from './components/AikyamAbout';
import AikyamMembers from './components/AikyamMembers';
import AikyamContact from './components/AikyamContact';
import AikyamChatbot from './components/AikyamChatbot';

function App() {
  return (
    <main className="app">
      <AikyamHero />
      <AikyamAbout />
      <AikyamMembers />
      <AikyamContact />
      <AikyamChatbot />
    </main>
  );
}

export default App;
