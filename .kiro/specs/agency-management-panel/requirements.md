# Requirements Document

## Introduction

Panel zarządzania agencją software house to kompleksowe narzędzie do administrowania wszystkimi aspektami działalności agencji interaktywnej/software house. System ma umożliwić efektywne zarządzanie projektami, klientami, zespołem, finansami i zasobami firmy w jednym miejscu.

## Requirements

### Requirement 1

**User Story:** Jako właściciel agencji, chcę mieć centralny dashboard z kluczowymi metrykami, żeby móc szybko ocenić stan firmy i podejmować strategiczne decyzje.

#### Acceptance Criteria

1. WHEN użytkownik loguje się do systemu THEN system SHALL wyświetlić dashboard z kluczowymi KPI
2. WHEN dashboard się ładuje THEN system SHALL pokazać przychody miesięczne, liczbę aktywnych projektów, wykorzystanie zespołu i zadowolenie klientów
3. WHEN użytkownik przegląda dashboard THEN system SHALL wyświetlić wykresy trendów dla ostatnich 6 miesięcy
4. WHEN dane się aktualizują THEN system SHALL odświeżyć metryki w czasie rzeczywistym

### Requirement 2

**User Story:** Jako project manager, chcę zarządzać wszystkimi projektami w jednym miejscu, żeby móc śledzić postępy i terminowość realizacji.

#### Acceptance Criteria

1. WHEN użytkownik otwiera sekcję projektów THEN system SHALL wyświetlić listę wszystkich projektów z ich statusami
2. WHEN użytkownik tworzy nowy projekt THEN system SHALL umożliwić wprowadzenie nazwy, klienta, budżetu, terminów i przypisanie zespołu
3. WHEN projekt ma zbliżający się deadline THEN system SHALL wysłać powiadomienie
4. WHEN użytkownik edytuje projekt THEN system SHALL zapisać zmiany i zaktualizować timeline
5. WHEN projekt zmienia status THEN system SHALL automatycznie powiadomić przypisanych członków zespołu

### Requirement 3

**User Story:** Jako właściciel agencji, chcę zarządzać bazą klientów i ich historią współpracy, żeby budować długotrwałe relacje biznesowe.

#### Acceptance Criteria

1. WHEN użytkownik dodaje nowego klienta THEN system SHALL zapisać dane kontaktowe, branżę i preferencje komunikacji
2. WHEN użytkownik przegląda profil klienta THEN system SHALL wyświetlić historię projektów, płatności i komunikacji
3. WHEN klient ma urodziny lub rocznicę współpracy THEN system SHALL wysłać przypomnienie
4. WHEN użytkownik wyszukuje klienta THEN system SHALL umożliwić filtrowanie po nazwie, branży lub statusie
5. WHEN klient nie płaci w terminie THEN system SHALL automatycznie oznaczyć go jako zalegający

### Requirement 4

**User Story:** Jako HR manager, chcę zarządzać zespołem i śledzić ich obciążenie pracą, żeby optymalnie przydzielać zadania i dbać o work-life balance.

#### Acceptance Criteria

1. WHEN użytkownik dodaje nowego pracownika THEN system SHALL zapisać dane osobowe, kompetencje i stawkę godzinową
2. WHEN użytkownik przegląda zespół THEN system SHALL wyświetlić aktualny poziom obciążenia każdego pracownika
3. WHEN pracownik ma przekroczone 40h tygodniowo THEN system SHALL wysłać ostrzeżenie o nadgodzinach
4. WHEN użytkownik planuje urlopy THEN system SHALL sprawdzić dostępność i konflikty z projektami
5. WHEN kończy się umowa pracownika THEN system SHALL wysłać przypomnienie o przedłużeniu

### Requirement 5

**User Story:** Jako księgowy, chcę śledzić finanse agencji i generować raporty, żeby mieć pełną kontrolę nad przepływami pieniężnymi.

#### Acceptance Criteria

1. WHEN użytkownik wprowadza fakturę THEN system SHALL zapisać kwotę, datę wystawienia i termin płatności
2. WHEN faktura jest przeterminowana THEN system SHALL automatycznie oznaczyć ją jako zaległą
3. WHEN użytkownik generuje raport miesięczny THEN system SHALL wyświetlić przychody, koszty i marżę
4. WHEN użytkownik eksportuje dane THEN system SHALL wygenerować plik Excel lub PDF
5. WHEN wpływa płatność THEN system SHALL automatycznie zaktualizować status faktury

### Requirement 6

**User Story:** Jako project manager, chcę śledzić czas pracy zespołu nad projektami, żeby dokładnie rozliczać klientów i analizować rentowność.

#### Acceptance Criteria

1. WHEN pracownik loguje czas pracy THEN system SHALL zapisać godziny z przypisaniem do konkretnego projektu i zadania
2. WHEN użytkownik przegląda timesheet THEN system SHALL wyświetlić podsumowanie godzin dla każdego projektu
3. WHEN miesiąc się kończy THEN system SHALL automatycznie wygenerować raport czasu pracy
4. WHEN projekt przekracza budżet godzinowy THEN system SHALL wysłać ostrzeżenie
5. WHEN pracownik nie loguje czasu przez 2 dni THEN system SHALL wysłać przypomnienie

### Requirement 7

**User Story:** Jako właściciel agencji, chcę mieć system powiadomień i alertów, żeby być na bieżąco z ważnymi wydarzeniami w firmie.

#### Acceptance Criteria

1. WHEN wydarzy się ważne zdarzenie THEN system SHALL wysłać powiadomienie email i w aplikacji
2. WHEN użytkownik konfiguruje preferencje THEN system SHALL respektować wybrane kanały komunikacji
3. WHEN alert jest krytyczny THEN system SHALL wysłać natychmiastowe powiadomienie SMS
4. WHEN użytkownik przegląda powiadomienia THEN system SHALL pokazać historię ostatnich 30 dni
5. WHEN powiadomienie zostanie przeczytane THEN system SHALL oznaczyć je jako przeczytane

### Requirement 8

**User Story:** Jako właściciel agencji, chcę mieć dostęp do analityki i raportów biznesowych, żeby podejmować decyzje oparte na danych.

#### Acceptance Criteria

1. WHEN użytkownik otwiera sekcję analityki THEN system SHALL wyświetlić kluczowe wskaźniki wydajności
2. WHEN użytkownik wybiera okres THEN system SHALL wygenerować raporty dla wybranego zakresu dat
3. WHEN użytkownik eksportuje raport THEN system SHALL umożliwić wybór formatu (PDF, Excel, CSV)
4. WHEN dane się zmieniają THEN system SHALL automatycznie aktualizować wykresy i metryki
5. WHEN użytkownik tworzy custom raport THEN system SHALL zapisać szablon do przyszłego użycia