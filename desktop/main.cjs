'use strict';
const {app,BrowserWindow,Menu,Tray,nativeImage,shell,session,Notification} = require('electron');
const path=require('node:path');
const HUB='https://talk.ipharmkorea.com/';
const ORIGIN=new URL(HUB).origin;
let window,tray,quitting=false;
app.setAppUserModelId('kr.co.ipharmkorea.dongwonhub');
if(!app.requestSingleInstanceLock())app.quit();
else app.on('second-instance',()=>{if(window){window.show();window.focus()}});
function createWindow(){
 window=new BrowserWindow({width:880,height:810,minWidth:600,minHeight:600,show:false,backgroundColor:'#fff',title:'동원HUB 메신저',icon:path.join(__dirname,'assets','icon.png'),autoHideMenuBar:true,webPreferences:{partition:'persist:dongwonhub',nodeIntegration:false,contextIsolation:true,sandbox:true,webviewTag:false}});
 window.once('ready-to-show',()=>window.show());
 window.loadURL(HUB+'?desktop=1');
 window.webContents.setWindowOpenHandler(({url})=>{if(url.startsWith('https://'))shell.openExternal(url);return {action:'deny'}});
 window.webContents.on('will-navigate',(event,url)=>{if(new URL(url).origin!==ORIGIN){event.preventDefault();if(url.startsWith('https://'))shell.openExternal(url)}});
 window.on('close',e=>{if(!quitting){e.preventDefault();window.hide()}});
 window.on('closed',()=>window=null);
}
app.whenReady().then(()=>{
 const ses=session.fromPartition('persist:dongwonhub');
 ses.setPermissionRequestHandler((contents,permission,callback)=>callback(permission==='notifications'&&contents.getURL().startsWith(ORIGIN)));
 ses.setPermissionCheckHandler((contents,permission)=>permission==='notifications'&&!!contents?.getURL().startsWith(ORIGIN));
 createWindow();
 const icon=nativeImage.createFromPath(path.join(__dirname,'assets','icon.png'));
 tray=new Tray(icon);tray.setToolTip('동원HUB 메신저');tray.setContextMenu(Menu.buildFromTemplate([{label:'동원HUB 열기',click:()=>{window?.show();window?.focus()}},{label:'종료',click:()=>{quitting=true;app.quit()}}]));tray.on('double-click',()=>{window?.show();window?.focus()});
});
app.on('window-all-closed',()=>{});
app.on('before-quit',()=>{quitting=true});
