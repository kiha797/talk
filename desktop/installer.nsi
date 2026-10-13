Unicode true
Name "동원HUB 메신저"
OutFile "../desktop-dist/DongwonHUB-Messenger-Setup-1.0.0.exe"
InstallDir "$PROGRAMFILES64\동원HUB 메신저"
InstallDirRegKey HKLM "Software\DongwonHUBMessenger" "InstallLocation"
RequestExecutionLevel admin
SetCompressor /SOLID lzma
Icon "assets/icon.ico"
UninstallIcon "assets/icon.ico"

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Section "설치" SecInstall
  SetShellVarContext all
  SetOutPath "$INSTDIR"
  File /r "../desktop-dist/win-unpacked/*"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateShortCut "$DESKTOP\동원HUB 메신저.lnk" "$INSTDIR\동원HUB 메신저.exe" "" "$INSTDIR\동원HUB 메신저.exe" 0
  CreateDirectory "$SMPROGRAMS\동원HUB"
  CreateShortCut "$SMPROGRAMS\동원HUB\동원HUB 메신저.lnk" "$INSTDIR\동원HUB 메신저.exe" "" "$INSTDIR\동원HUB 메신저.exe" 0
  CreateShortCut "$SMPROGRAMS\동원HUB\제거.lnk" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\DongwonHUBMessenger" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger" "DisplayName" "동원HUB 메신저"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger" "DisplayIcon" "$INSTDIR\동원HUB 메신저.exe"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger" "NoRepair" 1
SectionEnd

Section "Uninstall"
  SetShellVarContext all
  Delete "$DESKTOP\동원HUB 메신저.lnk"
  RMDir /r "$SMPROGRAMS\동원HUB"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKLM "Software\DongwonHUBMessenger"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\DongwonHUBMessenger"
SectionEnd
