const fs = require('fs');
const { execSync } = require('child_process');

const envContent = fs.readFileSync('.env.local', 'utf8');
const lines = envContent.split('\n');

for (let line of lines) {
  line = line.trim();
  if (!line || line.startsWith('#')) continue;
  
  // Match KEY=VALUE or KEY="VALUE" or KEY='VALUE'
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    // Remove wrapping quotes if they exist
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.substring(1, value.length - 1);
    }

    // Skip localhost URLs for production, but sync the keys
    if (key === 'NEXT_PUBLIC_APP_URL' || key === 'BETTER_AUTH_URL') {
      // We will handle these manually or keep them as placeholder
      console.log(`Skipping sync for ${key} to avoid localhost conflict`);
      continue;
    }

    try {
      console.log(`Syncing ${key}...`);
      execSync(`echo "${value}" | vercel env add ${key} production --yes`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to sync ${key}: ${err.message}`);
    }
  }
}
