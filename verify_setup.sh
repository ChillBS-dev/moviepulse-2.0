#!/bin/bash

# Movie Pulse - Setup Verification Script
# This script checks if all necessary files and configurations are in place

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║           🎬 MOVIE PULSE - SETUP VERIFICATION                            ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $2"
    else
        echo "❌ $2 - MISSING!"
        ((ERRORS++))
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $2"
    else
        echo "❌ $2 - MISSING!"
        ((ERRORS++))
    fi
}

# Function to check for string in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo "✅ $3"
    else
        echo "⚠️  $3 - NOT FOUND!"
        ((WARNINGS++))
    fi
}

echo "🔍 Checking Backend Configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backend files
check_file "backend/.env" "Backend .env file"
check_file "backend/manage.py" "Django manage.py"
check_file "backend/requirements.txt" "Backend requirements.txt"
check_dir "backend/movieapp/management/commands" "Management commands directory"
check_file "backend/movieapp/management/commands/warmup_cache.py" "Warmup cache command"
check_file "backend/movieapp/management/commands/clear_cache.py" "Clear cache command"
check_file "backend/CACHING.md" "Caching documentation"

# Check .env content
if [ -f "backend/.env" ]; then
    check_content "backend/.env" "TMDB_API_KEY" "TMDB_API_KEY in .env"
    check_content "backend/.env" "TMDB_ACCESS_TOKEN" "TMDB_ACCESS_TOKEN in .env"
fi

echo ""
echo "🔍 Checking Frontend Configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Frontend files
check_file "frontend/.env" "Frontend .env file"
check_file "frontend/package.json" "Frontend package.json"
check_file "frontend/src/services/api.js" "API service layer"
check_file "frontend/src/Hooks/useMovie.js" "useMovie hook"
check_file "frontend/src/Contexts/AppContext.js" "AppContext"

# Check .env content
if [ -f "frontend/.env" ]; then
    check_content "frontend/.env" "REACT_APP_API_URL" "REACT_APP_API_URL in .env"
fi

echo ""
echo "🔍 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "IMPLEMENTATION_SUMMARY.md" "Implementation summary"
check_file "GUEST_SESSIONS_README.md" "Guest sessions guide"
check_file "SETUP.md" "Setup instructions"
check_file "QUICK_REFERENCE.txt" "Quick reference"

echo ""
echo "🔍 Checking Modified Components..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "frontend/src/Components/Header.js" "Header component"
check_file "frontend/src/Components/Catalogue.js" "Catalogue component"
check_file "frontend/src/Components/LoginModal.js" "LoginModal component"
check_file "frontend/src/Components/UI/Card.js" "Card component"
check_file "frontend/src/Components/UI/Search.js" "Search component"
check_file "frontend/src/index.css" "Custom CSS with animations"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ ✅ ✅  ALL CHECKS PASSED! ✅ ✅ ✅"
    echo ""
    echo "Your Movie Pulse setup is complete!"
    echo ""
    echo "Next steps:"
    echo "1. Install backend dependencies: cd backend && pip install -r requirements.txt"
    echo "2. Run migrations: python manage.py migrate"
    echo "3. Warm up cache: python manage.py warmup_cache"
    echo "4. Start backend: python manage.py runserver"
    echo "5. In a new terminal, install frontend: cd frontend && npm install"
    echo "6. Start frontend: npm start"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  SETUP COMPLETE WITH WARNINGS"
    echo ""
    echo "Warnings: $WARNINGS"
    echo "Review the warnings above. The app should still work."
    echo ""
    exit 0
else
    echo "❌ SETUP INCOMPLETE"
    echo ""
    echo "Errors: $ERRORS"
    echo "Warnings: $WARNINGS"
    echo ""
    echo "Please address the errors above before running the application."
    echo ""
    exit 1
fi
