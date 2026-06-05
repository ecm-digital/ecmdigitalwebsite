#!/bin/bash

# Setup Cost Monitoring Cron Job
# Konfiguruje automatyczne monitorowanie kosztów AWS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔧 Konfiguracja automatycznego monitorowania kosztów AWS"

# Sprawdź czy skrypty istnieją
if [ ! -f "$SCRIPT_DIR/auto-cost-shutdown.sh" ]; then
    echo "❌ Brak skryptu auto-cost-shutdown.sh"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/bedrock-cost-optimization.sh" ]; then
    echo "❌ Brak skryptu bedrock-cost-optimization.sh"
    exit 1
fi

# Ustaw uprawnienia wykonywania
chmod +x "$SCRIPT_DIR/auto-cost-shutdown.sh"
chmod +x "$SCRIPT_DIR/bedrock-cost-optimization.sh"
chmod +x "$SCRIPT_DIR/optimize-cloudwatch-logs.sh"

echo "✅ Uprawnienia skryptów ustawione"

# Stwórz katalog dla logów
LOG_DIR="$PROJECT_DIR/logs/cost-monitoring"
mkdir -p "$LOG_DIR"

echo "✅ Katalog logów utworzony: $LOG_DIR"

# Przygotuj wpisy cron
CRON_ENTRIES="
# AWS Cost Monitoring - ECM Digital
# Codzienne monitorowanie kosztów o 23:00
0 23 * * * $SCRIPT_DIR/auto-cost-shutdown.sh >> $LOG_DIR/auto-shutdown.log 2>&1

# Cotygodniowe sprawdzenie Bedrock (niedziela o 22:00)
0 22 * * 0 $SCRIPT_DIR/bedrock-cost-optimization.sh >> $LOG_DIR/bedrock-optimization.log 2>&1

# Miesięczna optymalizacja CloudWatch Logs (1. dzień miesiąca o 01:00)
0 1 1 * * $SCRIPT_DIR/optimize-cloudwatch-logs.sh >> $LOG_DIR/cloudwatch-optimization.log 2>&1
"

echo "📋 Proponowane wpisy cron:"
echo "$CRON_ENTRIES"

# Sprawdź obecny crontab
echo ""
echo "📊 Obecny crontab:"
crontab -l 2>/dev/null || echo "Brak wpisów cron"

echo ""
echo "🔧 Aby dodać automatyczne monitorowanie kosztów, uruchom:"
echo "   crontab -e"
echo ""
echo "I dodaj następujące linie:"
echo "$CRON_ENTRIES"

# Opcjonalnie: automatyczne dodanie do cron
read -p "Czy chcesz automatycznie dodać te wpisy do cron? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Backup obecnego crontab
    crontab -l > "$LOG_DIR/crontab-backup-$(date +%Y%m%d-%H%M%S).txt" 2>/dev/null || true
    
    # Dodaj nowe wpisy
    (crontab -l 2>/dev/null || true; echo "$CRON_ENTRIES") | crontab -
    
    echo "✅ Wpisy cron dodane pomyślnie"
    echo "📋 Nowy crontab:"
    crontab -l
else
    echo "ℹ️  Wpisy cron nie zostały dodane automatycznie"
fi

echo ""
echo "📧 Aby otrzymywać raporty email, ustaw zmienną środowiskową:"
echo "   export NOTIFICATION_EMAIL=twoj-email@example.com"

echo ""
echo "✅ Konfiguracja automatycznego monitorowania kosztów zakończona"
echo ""
echo "📊 Harmonogram monitorowania:"
echo "   - Codziennie 23:00: Sprawdzenie i raport kosztów"
echo "   - Niedziela 22:00: Sprawdzenie Bedrock"
echo "   - 1. dzień miesiąca 01:00: Optymalizacja CloudWatch Logs"
echo ""
echo "📁 Logi będą zapisywane w: $LOG_DIR"