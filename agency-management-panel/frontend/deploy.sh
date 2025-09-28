#!/bin/bash

# Deployment script for agency management panel

echo "Building agency management panel..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo ""
    echo "To deploy to Vercel, run:"
    echo "  vercel --prod"
    echo ""
    echo "Or if you want to deploy to a different platform:"
    echo "  npm run start"
    echo ""
    echo "The application will be available at:"
    echo "  https://agency-management-panel.vercel.app"
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi