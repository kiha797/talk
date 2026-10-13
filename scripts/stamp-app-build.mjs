import {writeFileSync} from 'node:fs';
writeFileSync(new URL('../lib/app-build.ts',import.meta.url),`export const APP_BUILD_ID=${JSON.stringify(Date.now().toString())};\n`);
