'use strict';
const {ipcRenderer}=require('electron');
window.addEventListener('dongwon-hub:login',()=>ipcRenderer.send('hub:check-update'));
