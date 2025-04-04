import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Replace YOUR_FORM_ID with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormVisible = status === 'idle' || status === 'error' || status === 'sending';
  const isFormSubmitting = status === 'sending';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      {/* Alternative: Static Form with mailto link */}
      {isFormVisible ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-csharp-blue-500 focus:ring-csharp-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-csharp-blue-500 focus:ring-csharp-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-csharp-blue-500 focus:ring-csharp-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-csharp-blue-500 focus:ring-csharp-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={isFormSubmitting}
            className="w-full bg-csharp-blue-500 text-white py-2 px-4 rounded-md hover:bg-csharp-blue-600 focus:outline-none focus:ring-2 focus:ring-csharp-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isFormSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'error' && (
            <div className="text-red-600 dark:text-red-400">
              Failed to send message. Please try again later or contact us directly via email.
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-4">
            Alternatively, you can email us directly at:{' '}
            <a href="mailto:info@example.com" className="text-csharp-blue-500 hover:underline">
              info@example.com
            </a>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-xl font-medium text-green-700 dark:text-green-400 mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-green-600 dark:text-green-500 mb-4">
            Thanks for reaching out. We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Send Another Message
          </button>
        </div>
      )}
    </div>
  );
} 