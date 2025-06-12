import { useLocale ,useTranslations } from 'next-intl'; 
const RightPanel = ()=>{
  const t = useTranslations();
  const locale = useLocale();
  return(
    <div className="flex flex-col items-center justify-center w-1/2 h-screen bg-[#f9fbff] px-4">
  <div className="mb-6">
  <img src="/login-logo.svg" alt="Kamco Invest" className="mt-5 w-[164px] h-[54px] h-auto mb-15" />
  </div>
  <div className="absolute top-6 right-8 text-sm text-gray-700">
    {t("forgot-password-header")}{' '}
  <a href="/" className="font-semibold text-blue-900 hover:underline">
    {t("forgot-password-link")}
  </a>
</div>

  <div className="bg-white border-2 border-stone-200 w-full max-w-lg min-h-[calc(100vh-325px)] p-8 rounded-2xl shadow-2xl">
  <h1 className="pt-5 text-3xl md:text-3xl font-semibold text-[#002F6C] text-Mostserrat text-left">{t("forgot-password-title")}</h1>
  <p className="pt-4 block text-left text-12px text-gray-400 mb-1">
  {t("forgot-password-subtitle")}
  </p>
  <label className="block pt-2 font-semibold text-sm text-gray-400 mb-1">{t("email_label")}</label>
  <input
  type="email"
  placeholder={t("forgot-password-email-placeholder")}
  className="border-[#002F6C] pl-2 mt-1 focus:border-[#002F6C] focus:outline-none focus:ring-0 transition-all duration-200 w-full border border-stone-200 px-10 py-3 rounded-lg placeholder-gray-300 text-xs p-5"
  />
  
  <button className="mt-5 w-full bg-[#002b5b] hover:bg-[#001f40] text-white py-3 rounded-md font-medium transition duration-200">
  {t("forgot-password-reset-button")}
  </button>
  
  <span className="flex cursor-pointer w-full items-center justify-center shadow-none h-[57px] text-base font-medium  mt-3 underline">
  <a href="/" className="text-lg text-center text-[#002F6C] hover:underline font-medium">
  {t("back-button")}
  </a>
    </span>
  </div>
  </div>
)
}
export default RightPanel;
