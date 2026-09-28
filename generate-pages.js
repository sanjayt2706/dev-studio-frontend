import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = ['About', 'Team', 'Projects', 'Announcements', 'Events', 'Resources', 'Join'];
const adminPages = ['AdminLogin', 'AdminDashboard', 'AdminMembers'];

pages.forEach(page => {
  fs.mkdirSync(path.join(__dirname, 'src/pages'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, 'src/pages/admin'), { recursive: true });
  const content = [
    "import React from 'react';",
    "",
    "const " + page + " = () => {",
    "  return (",
    "    <div className=\"container mx-auto px-6 py-24 min-h-screen\">",
    "      <h1 className=\"text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8\">" + page.toUpperCase() + "</h1>",
    "      <p className=\"text-gray-400\">Content coming soon...</p>",
    "    </div>",
    "  );",
    "};",
    "",
    "export default " + page + ";"
  ].join('\\n');
  
  fs.writeFileSync(path.join(__dirname, 'src/pages', page + '.jsx'), content);
});

adminPages.forEach(page => {
  const content = [
    "import React from 'react';",
    "",
    "const " + page + " = () => {",
    "  return (",
    "    <div>",
    "      <h1 className=\"text-2xl font-bold text-white mb-6\">" + page.replace('Admin', '') + "</h1>",
    "      <p className=\"text-gray-400\">Admin component coming soon...</p>",
    "    </div>",
    "  );",
    "};",
    "",
    "export default " + page + ";"
  ].join('\\n');
  
  fs.writeFileSync(path.join(__dirname, 'src/pages/admin', page + '.jsx'), content);
});

console.log('Placeholder pages generated.');
