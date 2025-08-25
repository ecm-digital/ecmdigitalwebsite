import emailjs from '@emailjs/browser';

// Inicjalizacja EmailJS
emailjs.init("YOUR_PUBLIC_KEY"); // TODO: Zamień na swój klucz EmailJS

export interface EmailTemplate {
  subject: string;
  html: string;
  recipientEmail: string;
  recipientName: string;
}

export class EmailService {
  private static SERVICE_ID = 'YOUR_SERVICE_ID'; // TODO: Zamień na swój Service ID
  private static WELCOME_TEMPLATE_ID = 'YOUR_WELCOME_TEMPLATE_ID'; // TODO: Zamień na ID szablonu powitalnego
  private static FOLLOWUP_TEMPLATE_ID = 'YOUR_FOLLOWUP_TEMPLATE_ID'; // TODO: Zamień na ID szablonu follow-up

  // Wysyłanie powitalnego emaila
  static async sendWelcomeEmail(clientData: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
  }) {
    try {
      const templateParams = {
        to_email: clientData.email,
        to_name: `${clientData.firstName} ${clientData.lastName}`,
        company: clientData.company || 'Twoja firma',
        login_url: `${window.location.origin}/auth/login`,
        dashboard_url: `${window.location.origin}/dashboard`,
        support_email: 'support@ecm-digital.com',
        support_phone: '+48 123 456 789'
      };

      const result = await emailjs.send(
        this.SERVICE_ID,
        this.WELCOME_TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Welcome email sent successfully:', result);
      return { success: true, result };

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error };
    }
  }

  // Wysyłanie follow-up emaila (dzień po rejestracji)
  static async sendFollowupEmail(clientData: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
  }) {
    try {
      const templateParams = {
        to_email: clientData.email,
        to_name: `${clientData.firstName} ${clientData.lastName}`,
        company: clientData.company || 'Twoja firma',
        login_url: `${window.location.origin}/auth/login`,
        services_url: `${window.location.origin}/services`,
        contact_url: `${window.location.origin}/contact`,
        support_email: 'support@ecm-digital.com'
      };

      const result = await emailjs.send(
        this.SERVICE_ID,
        this.FOLLOWUP_TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Follow-up email sent successfully:', result);
      return { success: true, result };

    } catch (error) {
      console.error('❌ Error sending follow-up email:', error);
      return { success: false, error };
    }
  }

  // Wysyłanie emaila z ofertą (3 dni po rejestracji)
  static async sendOfferEmail(clientData: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
  }) {
    try {
      const templateParams = {
        to_email: clientData.email,
        to_name: `${clientData.firstName} ${clientData.lastName}`,
        company: clientData.company || 'Twoja firma',
        offer_url: `${window.location.origin}/offer`,
        consultation_url: `${window.location.origin}/consultation`,
        portfolio_url: `${window.location.origin}/portfolio`,
        support_email: 'support@ecm-digital.com',
        special_discount: '20%'
      };

      const result = await emailjs.send(
        this.SERVICE_ID,
        'OFFER_TEMPLATE_ID', // TODO: Stwórz szablon oferty
        templateParams
      );

      console.log('✅ Offer email sent successfully:', result);
      return { success: true, result };

    } catch (error) {
      console.error('❌ Error sending offer email:', error);
      return { success: false, error };
    }
  }

  // Harmonogram automatycznych emaili
  static scheduleFollowupEmails(clientData: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
  }) {
    const client = clientData;

    // Email powitalny (natychmiast)
    setTimeout(() => {
      this.sendWelcomeEmail(client);
    }, 1000);

    // Email follow-up (1 dzień)
    setTimeout(() => {
      this.sendFollowupEmail(client);
    }, 24 * 60 * 60 * 1000);

    // Email z ofertą (3 dni)
    setTimeout(() => {
      this.sendOfferEmail(client);
    }, 3 * 24 * 60 * 60 * 1000);

    console.log('📅 Email schedule set up for:', client.email);
  }
}

// Szablony HTML dla emaili (fallback jeśli EmailJS nie działa)
export const EmailTemplates = {
  welcome: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Witamy w ECM Digital!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Witamy w ECM Digital!</h1>
        <p>Cześć ${data.firstName}, dziękujemy za rejestrację!</p>
      </div>

      <div class="content">
        <h2>Co dalej?</h2>
        <ul>
          <li><strong>Zaloguj się</strong> do swojego konta</li>
          <li><strong>Odkryj dashboard</strong> - zobacz swoje projekty</li>
          <li><strong>Skontaktuj się z nami</strong> jeśli masz pytania</li>
        </ul>

        <a href="${data.login_url}" class="button">Zaloguj się teraz</a>

        <h3>Twoje dane logowania:</h3>
        <p><strong>Email:</strong> ${data.email}</p>

        <h3>Potrzebujesz pomocy?</h3>
        <p>Skontaktuj się z nami:</p>
        <p>📧 ${data.support_email}<br>
        📞 ${data.support_phone}</p>
      </div>

      <div class="footer">
        <p>&copy; 2025 ECM Digital. Wszelkie prawa zastrzeżone.</p>
        <p>Ta wiadomość została wysłana automatycznie, prosimy nie odpowiadać.</p>
      </div>
    </body>
    </html>
  `,

  followup: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Jak się masz? - ECM Digital</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .services { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>👋 Jak się masz, ${data.firstName}?</h1>
        <p>Minął już dzień od Twojej rejestracji w ECM Digital</p>
      </div>

      <div class="content">
        <p>Mam nadzieję, że udało Ci się już zalogować i poznać nasz system!</p>

        <div class="services">
          <h3>🚀 Gotowy na więcej?</h3>
          <p>Sprawdź nasze usługi:</p>
          <ul>
            <li>✅ <strong>Strony WWW</strong> - nowoczesne, responsywne</li>
            <li>✅ <strong>Sklepy Shopify</strong> - sprzedaż online bez problemów</li>
            <li>✅ <strong>Aplikacje mobilne</strong> - iOS i Android</li>
            <li>✅ <strong>Automatyzacje</strong> - oszczędzaj czas i pieniądze</li>
          </ul>
        </div>

        <a href="${data.services_url}" class="button">Zobacz nasze usługi</a>

        <h3>Masz pytania?</h3>
        <p>Chętnie pomożemy! Napisz do nas lub umów się na bezpłatną konsultację.</p>

        <p>📧 ${data.support_email}</p>
      </div>

      <div class="footer">
        <p>&copy; 2025 ECM Digital. Wszelkie prawa zastrzeżone.</p>
      </div>
    </body>
    </html>
  `,

  offer: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Specjalna oferta dla Ciebie! - ECM Digital</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; font-weight: bold; }
        .offer { background: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .discount { font-size: 36px; font-weight: bold; color: #dc2626; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔥 SPECJALNA OFERTA!</h1>
        <p>${data.firstName}, przygotowaliśmy coś wyjątkowego dla Ciebie</p>
      </div>

      <div class="content">
        <div class="offer">
          <h2 class="discount">${data.special_discount} ZNIŻKI</h2>
          <p>na wszystkie nasze usługi przez ograniczony czas!</p>
          <p><strong>Oferta ważna tylko przez 7 dni</strong></p>
        </div>

        <h3>🎯 Co możesz zyskać:</h3>
        <ul>
          <li>✅ <strong>20% mniej</strong> za stronę WWW</li>
          <li>✅ <strong>20% mniej</strong> za sklep Shopify</li>
          <li>✅ <strong>20% mniej</strong> za aplikację mobilną</li>
          <li>✅ <strong>Bezpłatna konsultacja</strong> (wartość 500 PLN)</li>
          <li>✅ <strong>Priorytetowe wsparcie</strong></li>
        </ul>

        <a href="${data.offer_url}" class="button">Skorzystaj z oferty teraz!</a>

        <h3>📞 Chcesz porozmawiać?</h3>
        <p>Umów się na bezpłatną konsultację - pomożemy dobrać najlepsze rozwiązanie dla ${data.company}.</p>

        <p>📧 ${data.support_email}</p>
      </div>

      <div class="footer">
        <p>&copy; 2025 ECM Digital. Wszelkie prawa zastrzeżone.</p>
        <p>Oferta ograniczona czasowo. Sprawdź regulamin na stronie.</p>
      </div>
    </body>
    </html>
  `
};
