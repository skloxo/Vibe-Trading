const modules = ['core', 'react', 'legacy'];
for (const m of modules) {
    try {
        const mod = require(`./frontend/node_modules/react-grid-layout/dist/${m}.js`);
        console.log(`${m} keys:`, Object.keys(mod));
    } catch (err) {
        console.log(`Failed to require ${m}:`, err.message);
    }
}
