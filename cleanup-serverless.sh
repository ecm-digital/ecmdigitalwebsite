#!/bin/bash

# Skrypt do usunięcia OpenSearch Serverless collections
# UWAGA: To usunie wszystkie dane w collections!

set -e

REGION="eu-west-1"

echo "⚠️  UWAGA: Ten skrypt usunie wszystkie OpenSearch Serverless collections!"
echo "To spowoduje utratę wszystkich danych w collections."
echo ""
read -p "Czy na pewno chcesz kontynuować? (wpisz 'TAK' aby potwierdzić): " confirm

if [ "$confirm" != "TAK" ]; then
    echo "Anulowano."
    exit 0
fi

echo "Pobieranie listy collections..."
aws opensearchserverless list-collections --region $REGION > /tmp/collections-to-delete.json

if [ $? -eq 0 ]; then
    COLLECTIONS=$(jq -r '.collectionSummaries[].name' /tmp/collections-to-delete.json)
    
    for collection in $COLLECTIONS; do
        echo "Usuwanie collection: $collection"
        aws opensearchserverless delete-collection --name "$collection" --region $REGION
        
        if [ $? -eq 0 ]; then
            echo "✅ Usunięto collection: $collection"
        else
            echo "❌ Błąd podczas usuwania collection: $collection"
        fi
    done
    
    echo ""
    echo "✅ Zakończono usuwanie collections"
    echo "💰 To powinno znacznie zmniejszyć koszty AWS!"
    
else
    echo "❌ Nie można pobrać listy collections"
    exit 1
fi

rm -f /tmp/collections-to-delete.json
