// src/pages/login.jsx
import LoginPage from "@/components/LoginPage";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations(); 
  return (
    <main>
      <LoginPage />
    </main>
  );
}

export async function getStaticProps({ locale }) {
  
  const messages = (await import(`../messages/${locale}.json`)).default;
  return {
    props: {
      messages,
    },
  };
}
