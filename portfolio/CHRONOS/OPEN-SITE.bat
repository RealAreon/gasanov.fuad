@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Opening CHRONOS static site (index.html)...
start "" "%~dp0index.html"
