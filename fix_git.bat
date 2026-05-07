@echo off
echo Pulling from dev with unrelated histories allowed...
git pull origin dev --allow-unrelated-histories

echo.
echo Adding changes...
git add .

echo.
echo Committing merge...
git commit -m "Merge dev into basecode"

echo.
echo ========================================================
echo Done! If it failed with "Automatic merge failed",
echo please open your files in the editor to resolve conflicts,
echo then run "git add ." and "git commit" manually.
echo ========================================================
pause
