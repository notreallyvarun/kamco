import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    const active = stored || router.locale || 'en';
    setLocale(active);

    document.documentElement.lang = active;
    document.documentElement.dir = active === 'ar' ? 'rtl' : 'ltr';
  }, [router.locale]);

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  return (
    <div
      onClick={toggleLanguage}
      className={`fixed top-8 z-10 w-fit bg-[#6B75801A] p-2 cursor-pointer rounded-full flex items-center gap-2
        ${locale === 'ar' ? 'left-4' : 'right-4'}
      `}
    >
      <span className="text-sm font-semibold text-[#000000]">
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
      <img
        src={locale === 'en' ? '/arabic.svg' : '/english.svg'}
        alt="language"
        className="w-[26px] h-[26px] rounded-full"
      />
    </div>
  );
}
