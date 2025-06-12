import { NextIntlClientProvider } from 'next-intl';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  
  return (
    <NextIntlClientProvider
      messages={pageProps.messages}
      locale={pageProps.locale || 'en'}
    >
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}
