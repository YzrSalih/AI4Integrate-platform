
import React, { useState } from "react";
import { FaQuestionCircle, FaEnvelope, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Go to your profile page, click 'Change Password', and follow the instructions."
  },
  {
    q: "How can I contact support?",
    a: "You can use the contact form below or email us at support@ai4integrate.com."
  },
  {
    q: "Where can I find my certificates?",
    a: "Certificates are available on your Profile page under the Certificates section."
  }
];

export default function HelpAndSupport() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-0 border border-blue-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-8 py-8">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <FaQuestionCircle className="text-blue-600 text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-1">Help & Support</h2>
            <div className="text-blue-100 text-base">Find answers, contact support, or request help below.</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 p-8">
          {/* FAQ Section */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaQuestionCircle className="text-blue-400" /> Frequently Asked Questions</h3>
            <ul className="space-y-4">
              {faqs.map((faq, i) => (
                <li key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                  <div className="font-semibold text-gray-800 mb-1">{faq.q}</div>
                  <div className="text-gray-600 text-sm">{faq.a}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaEnvelope className="text-blue-400" /> Contact Support</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50"
                value={form.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="How can we help you?"
                className="w-full p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50 min-h-[100px]"
                value={form.message}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-lg flex items-center justify-center gap-2"
              >
                <FaEnvelope /> Send Request
              </button>
            </form>
            {submitted && (
              <div className="mt-4 flex flex-col items-center">
                <FaCheckCircle className="text-green-500 text-3xl mb-1" />
                <div className="text-green-600 font-semibold text-center">Your request has been sent!</div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Channels */}
        <div className="bg-blue-50 border-t border-blue-100 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-700 font-semibold">
            <FaEnvelope className="text-blue-400" />
            <span>Email:</span>
            <a href="mailto:support@ai4integrate.com" className="text-blue-600 underline">support@ai4integrate.com</a>
          </div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold">
            <FaPhoneAlt className="text-blue-400" />
            <span>Phone:</span>
            <a href="tel:+9000000000" className="text-blue-600 underline">+90 000 000 00 00</a>
          </div>
        </div>
      </div>
    </div>
  );
}
