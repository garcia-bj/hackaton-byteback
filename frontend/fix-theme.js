const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-navy-900/g, 'bg-slate-100');
    content = content.replace(/bg-navy-800/g, 'bg-white');
    content = content.replace(/bg-navy-700/g, 'bg-slate-200');
    
    // Texts
    content = content.replace(/text-white/g, 'text-slate-900');
    content = content.replace(/text-navy-700/g, 'text-slate-500');
    content = content.replace(/text-navy-900/g, 'text-white'); 
    
    // Light text colors that need darkening for light bg
    content = content.replace(/text-cyan-400/g, 'text-teal-700');
    content = content.replace(/text-teal-500/g, 'text-teal-600');
    content = content.replace(/text-teal-400/g, 'text-teal-600');
    
    // Elements
    content = content.replace(/from-teal-500 to-cyan-400/g, 'from-teal-600 to-teal-400');
    content = content.replace(/bg-cyan-400/g, 'bg-teal-500');
    content = content.replace(/bg-teal-500/g, 'bg-teal-600');
    
    // Borders
    content = content.replace(/border-navy-700/g, 'border-slate-300');
    content = content.replace(/border-navy-800/g, 'border-slate-200');
    content = content.replace(/border-teal-500/g, 'border-teal-600/30');

    // Ring
    content = content.replace(/ring-cyan-400/g, 'ring-teal-500');

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir('./src/components');
walkDir('./src/app');
console.log('Theme replaced successfully');
