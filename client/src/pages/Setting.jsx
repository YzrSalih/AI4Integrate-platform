import React, { useState } from "react";

const translations = {
  English: {
    settings: "Settings",
    language: "Language",
    notifications: "Notifications",
    email: "Email Notifications",
    sms: "SMS Notifications",
    push: "Push Notifications",
    save: "Save Changes",
    saved: "Your changes have been saved successfully!"
  },
  Turkish: {
    settings: "Ayarlar",
    language: "Dil",
    notifications: "Bildirimler",
    email: "E-posta Bildirimleri",
    sms: "SMS Bildirimleri",
    push: "Anlık Bildirimler",
    save: "Değişiklikleri Kaydet",
    saved: "Değişiklikler başarıyla kaydedildi!"
  },
  German: {
    settings: "Einstellungen",
    language: "Sprache",
    notifications: "Benachrichtigungen",
    email: "E-Mail-Benachrichtigungen",
    sms: "SMS-Benachrichtigungen",
    push: "Push-Benachrichtigungen",
    save: "Änderungen speichern",
    saved: "Ihre Änderungen wurden erfolgreich gespeichert!"
  }
};

export default function Setting() {
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const t = translations[language];

  // Simple validation helpers
  const emailValid = !notifications.email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailValue);
  const phoneValid = !notifications.sms || /^\+?[0-9\s-]{7,}$/.test(phoneValue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">{t.settings}</h2>

        {/* Language Setting */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-2">{t.language}</label>
          <select
            className="w-full p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Turkish">Türkçe</option>
            <option value="German">Deutsch</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-4">{t.notifications}</label>
          <div className="space-y-3">
            {/* Email notification */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => setNotifications(n => ({ ...n, email: !n.email }))}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700">{t.email}</span>
            </label>
            {notifications.email && (
              <input
                type="email"
                className={`w-full mt-2 p-3 rounded-xl border ${emailValid ? 'border-blue-200' : 'border-red-400'} focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50`}
                placeholder="your@email.com"
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                // removed onBlur, no touched state
              />
            )}
            {/* SMS notification */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => setNotifications(n => ({ ...n, sms: !n.sms }))}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700">{t.sms}</span>
            </label>
            {notifications.sms && (
              <input
                type="tel"
                className={`w-full mt-2 p-3 rounded-xl border ${phoneValid ? 'border-blue-200' : 'border-red-400'} focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50`}
                placeholder="+90 555 555 55 55"
                value={phoneValue}
                onChange={e => setPhoneValue(e.target.value)}
                // removed onBlur, no touched state
              />
            )}
            {/* Push notification */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => setNotifications(n => ({ ...n, push: !n.push }))}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-gray-700">{t.push}</span>
            </label>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-lg disabled:opacity-60"
          disabled={
            (notifications.email && (!emailValue || !emailValid)) ||
            (notifications.sms && (!phoneValue || !phoneValid))
          }
          onClick={() => setShowModal(true)}
        >
          {t.save}
        </button>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
              <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div className="text-lg font-bold text-gray-800 mb-2 text-center">{t.saved}</div>
              <button
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                onClick={() => setShowModal(false)}
              >OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
