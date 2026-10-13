import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
const command=(bin,args)=>{const result=spawnSync(bin,args,{stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)process.exit(result.status||1)};
if(process.platform==='win32')command('electron-builder',['--win','nsis','--x64']);
else{
 command('electron-builder',['--win','dir','--x64']);
 const nsis=process.env.MAKENSIS || path.join(homedir(),'.cache/electron-builder/nsis/nsis-3.0.4.1/linux/makensis');
 if(!existsSync(nsis))throw new Error('Linux NSIS compiler missing. Set MAKENSIS to the makensis executable.');
 command(nsis,['installer.nsi']);
}
