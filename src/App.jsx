import React, { useEffect, useState } from 'react';
import AikyamHero from './components/AikyamHero';
import AikyamAbout from './components/AikyamAbout';
import AikyamMembers from './components/AikyamMembers';
import AikyamContact from './components/AikyamContact';
import AikyamChatbot from './components/AikyamChatbot';
import SongRequestForm from './components/SongRequestForm';

function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/request'))   return 'request';
    if (hash.startsWith('#/queue'))     return 'queue';
    if (hash.startsWith('#/performer')) return 'performer';
    return 'home';
  });

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/request'))   setView('request');
      else if (hash.startsWith('#/queue'))     setView('queue');
      else if (hash.startsWith('#/performer')) setView('performer');
      else setView('home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="App">
      {view === 'home'      && (<>
        <AikyamHero />
        <AikyamAbout />
        <AikyamMembers />
        <AikyamContact />
        <AikyamChatbot />
      </>)}
      {view === 'request'   && <SongRequestForm />}
      {/* {view === 'queue'     && <QueueView />}
      {view === 'performer' && <PerformerGuard />} */}
    </div>
  );
  // return (
  //   <main className="app">
  //     <AikyamHero />
  //     <AikyamAbout />
  //     <AikyamMembers />
  //     <AikyamContact />
  //     <AikyamChatbot />
  //   </main>
  // );
}

export default App;
