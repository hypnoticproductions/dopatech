// Minimal React entry point for build compatibility
// The actual site functionality is in public/index.html

import React from 'react';
import ReactDOM from 'react-dom/client';

// Empty component - all content is in the HTML file
const App = () => null;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
