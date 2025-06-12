import React from "react";
import { useTranslations} from "next-intl";
const LeftPanel = () => {
  const t = useTranslations();
  return (
    <div className="relative hidden md:flex w-1/2 bg-gradient-to-b from-[#005ed8] via-[#002f6c] to-[#002659] flex-col justify-between py-20 px-10 text-white">
      <div>
        <h2 className="mb-10 text-2xl lg:text-3xl font-apple font-semibold text-center">
          {t("welcome_heading")}<br />
          {t("welcome_subheading")}
        </h2>
        <p className="font-apple mt-1 text-center leading-relaxed">
          {t("welcome_description")}
        </p>
      </div>

      <img
        src="/ellipse.svg"
        alt="Swoosh"
        className="absolute left-0 bottom-0 z-0 object-cover opacity-60"
      />

      <img
        src="/onboarding.png"
        alt="Chart"
        className="relative z-30 h-[400px] object-contain"
      />

      <p className="absolute bottom-4 left-4 text-white text-sm z-20 font-sans drop-shadow">
        {t("support_message")}{" "}
        <a href="mailto:support@kamcoinvest.com" className="underline">
          support@kamcoinvest.com
        </a>
      </p>
    </div>
  );
};

export default LeftPanel;
