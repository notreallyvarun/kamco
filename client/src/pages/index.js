// src/pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from "next-intl"; // Keep this if you use it globally or for loading messages

export default function Home() {
  const router = useRouter();
  const t = useTranslations(); // Keep this for messages prop if needed by NextIntlProvider

  useEffect(() => {
    // Check if user is logged in (e.g., by checking access_token in localStorage)
    const token = localStorage.getItem('access_token');

    if (!token) {
      // If not logged in, redirect to the login page
      router.push('/login');
    } else {
      
      router.push('/dashboard');
    }
  }, [router]); 

  
  
}

// Keep getStaticProps to ensure next-intl messages are loaded for the root page
// even if it just redirects, as NextIntlProvider in _app.js still expects them.
export async function getStaticProps({ locale }) {
  // Ensure the messages are loaded for the specific locale
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return {
    props: {
      messages,
    },
  };
}
