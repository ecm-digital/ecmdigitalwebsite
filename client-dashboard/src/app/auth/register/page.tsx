"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { EmailService } from '@/lib/email-service';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    // 🔥 NOWE POLA MARKETINGOWE
    source: '', // Skąd dowiedzieli się o nas
    budget: '', // Budżet na projekt
    timeline: '', // Termin realizacji
    goals: '', // Cele biznesowe
    currentWebsite: '', // Czy mają stronę?
    previousExperience: '', // Doświadczenie z IT
    referralSource: '', // Jeśli przez polecenie - od kogo
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }

    setIsLoading(true);

    try {
      // Pomiń Supabase i bezpośrednio dodaj użytkownika do DynamoDB
      console.log('🔍 Starting registration process...');

      const verifyResponse = await fetch('/api/auth/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          firstName: formData.fullName.split(' ')[0] || '',
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
          company: formData.companyName,
          // 🔥 NOWE POLA MARKETINGOWE
          marketingData: {
            source: formData.source,
            budget: formData.budget,
            timeline: formData.timeline,
            goals: formData.goals,
            currentWebsite: formData.currentWebsite,
            previousExperience: formData.previousExperience,
            referralSource: formData.referralSource,
            phone: formData.phone
          }
        }),
      });

      console.log('📝 Verify response status:', verifyResponse.status);

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error('❌ Verify endpoint error:', errorText);
        throw new Error(`Błąd rejestracji: ${errorText}`);
      }

      const verifyData = await verifyResponse.json();
      console.log('✅ User added to DynamoDB:', verifyData);

      // 🔥 POWIADOMIENIA: Wyślij webhook do panelu zarządzania
      try {
        const notificationResponse = await fetch('http://localhost:3001/api/notifications/new-client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'new_client_registration',
            client: {
              email: formData.email,
              fullName: formData.fullName,
              companyName: formData.companyName,
              phone: formData.phone,
              registrationTime: new Date().toISOString(),
              source: 'client_dashboard'
            },
            priority: 'high',
            message: `🎉 NOWY KLIENT: ${formData.fullName} z firmy ${formData.companyName || 'Nie podano'}`
          }),
        });

        if (notificationResponse.ok) {
          console.log('✅ Notification sent to agency management panel');
        } else {
          console.warn('⚠️ Could not send notification:', await notificationResponse.text());
        }
      } catch (notificationError) {
        console.warn('⚠️ Notification system not available:', notificationError);
      }

      // Opcjonalnie: Spróbuj zapisać dane w panelu zarządzania agencji
      try {
        const agencyResponse = await fetch('http://localhost:3001/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            contact_person: formData.fullName,
            company_name: formData.companyName,
            phone: formData.phone,
            status: 'active',
            source: 'registration',
          }),
        });

        if (agencyResponse.ok) {
          console.log('✅ User also saved in agency management panel');
        } else {
          console.warn('⚠️ Could not save to agency management panel:', await agencyResponse.text());
        }
      } catch (agencyError) {
        console.warn('⚠️ Agency management panel not available:', agencyError);
      }

      // 🔥 WYŚLIJ EMAIL POWITALNY
      try {
        // Podziel fullName na firstName i lastName
        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const emailResult = await EmailService.sendWelcomeEmail({
          email: formData.email,
          firstName,
          lastName,
          company: formData.companyName
        });

        if (emailResult.success) {
          console.log('✅ Welcome email sent');
        } else {
          console.warn('⚠️ Welcome email failed:', emailResult.error);
        }

        // Zaplanuj automatyczne follow-up emaile
        EmailService.scheduleFollowupEmails({
          email: formData.email,
          firstName,
          lastName,
          company: formData.companyName
        });

      } catch (emailError) {
        console.warn('⚠️ Email system error:', emailError);
        // Nie przerywamy rejestracji jeśli email się nie wysłał
      }

      toast.success('Rejestracja udana! Sprawdź swoją skrzynkę email.');
      router.push('/auth/login');

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Błąd rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Utwórz konto
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Dołącz do grona naszych klientów
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Imię i nazwisko *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jan Kowalski"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Nazwa firmy
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Moja Firma Sp. z o.o."
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+48 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adres email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="jan@mojafirm.pl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Hasło *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Minimum 8 znaków"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Potwierdź hasło *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Powtórz hasło"
              />
            </div>

            {/* 🔥 NOWE POLA MARKETINGOWE - OPCJONALNE */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-900 mb-4">
                🏆 Pomóż nam lepiej Ci pomóc!
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Te informacje pomogą nam przygotować najlepszą ofertę dla Ciebie (wszystko jest opcjonalne)
              </p>

              <div className="space-y-4">
                {/* Źródło pozyskania */}
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                    Skąd dowiedziałeś się o nas?
                  </label>
                  <select
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Wybierz opcję...</option>
                    <option value="google">Google / wyszukiwarka</option>
                    <option value="social-media">Media społecznościowe</option>
                    <option value="referral">Polecenie od znajomego</option>
                    <option value="advertisement">Reklama online</option>
                    <option value="website">Przez stronę internetową</option>
                    <option value="other">Inne</option>
                  </select>
                </div>

                {/* Jeśli przez polecenie - od kogo */}
                {formData.source === 'referral' && (
                  <div>
                    <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700">
                      Od kogo otrzymałeś polecenie?
                    </label>
                    <input
                      id="referralSource"
                      name="referralSource"
                      type="text"
                      value={formData.referralSource}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Imię i nazwisko lub firma"
                    />
                  </div>
                )}

                {/* Budżet */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Orientacyjny budżet na projekt
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Wybierz zakres...</option>
                    <option value="5k-15k">5,000 - 15,000 PLN</option>
                    <option value="15k-30k">15,000 - 30,000 PLN</option>
                    <option value="30k-50k">30,000 - 50,000 PLN</option>
                    <option value="50k-100k">50,000 - 100,000 PLN</option>
                    <option value="100k+">Powyżej 100,000 PLN</option>
                  </select>
                </div>

                {/* Termin */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                    Preferowany termin realizacji
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Wybierz termin...</option>
                    <option value="asap">Jak najszybciej</option>
                    <option value="1month">W ciągu miesiąca</option>
                    <option value="2-3months">2-3 miesiące</option>
                    <option value="3-6months">3-6 miesięcy</option>
                    <option value="6months+">Powyżej 6 miesięcy</option>
                  </select>
                </div>

                {/* Cele biznesowe */}
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                    Jakie są Twoje główne cele?
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    rows={3}
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="np. Zwiększyć sprzedaż online, poprawić wizerunek firmy, zautomatyzować procesy..."
                  />
                </div>

                {/* Aktualna strona */}
                <div>
                  <label htmlFor="currentWebsite" className="block text-sm font-medium text-gray-700">
                    Czy masz już stronę internetową?
                  </label>
                  <select
                    id="currentWebsite"
                    name="currentWebsite"
                    value={formData.currentWebsite}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentWebsite: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Wybierz opcję...</option>
                    <option value="no">Nie mam strony</option>
                    <option value="basic">Mam prostą stronę</option>
                    <option value="professional">Mam profesjonalną stronę</option>
                    <option value="ecommerce">Mam sklep internetowy</option>
                  </select>
                </div>

                {/* Doświadczenie z IT */}
                <div>
                  <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700">
                    Twoje doświadczenie z projektami IT
                  </label>
                  <select
                    id="previousExperience"
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, previousExperience: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Wybierz poziom...</option>
                    <option value="beginner">Początkujący - pierwszy projekt</option>
                    <option value="intermediate">Średniozaawansowany</option>
                    <option value="advanced">Doświadczony - wiele projektów</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Masz już konto? Zaloguj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

