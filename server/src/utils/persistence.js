const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const readJSON = (filename, defaultValue = null) => {
  try {
    const file = path.join(dataDir, filename);
    if (!fs.existsSync(file)) return defaultValue;
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('readJSON error', err);
    return defaultValue;
  }
};

const writeJSON = (filename, obj) => {
  try {
    const file = path.join(dataDir, filename);
    fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('writeJSON error', err);
  }
};

// module.exports = { readJSON, writeJSON };
  // try {
  //   ensureDataDir();
  //   const full = path.join(DATA_DIR, filename);
  //   fs.writeFileSync(full, JSON.stringify(obj, null, 2), 'utf8');
  //   return true;
  // } catch (err) {
  //   console.error('writeJSON error', err);
  //   return false;
  // }
// };

module.exports = { readJSON, writeJSON };
