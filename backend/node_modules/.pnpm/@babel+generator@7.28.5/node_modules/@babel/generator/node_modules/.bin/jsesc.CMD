@SETLOCAL
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\..\..\..\jsesc\bin\jsesc" %*
) ELSE (
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\..\..\..\jsesc\bin\jsesc" %*
)
