'use client';

import { useState } from "react";
import SecurityTipsSheet from "./SecurityTips";
import QRCodeModal from "./QRCodeModal";
import { useTranslations } from "next-intl";

const actions = [
  { key: "download_app", icon: "/download-app.svg" },
  { key: "announcements", icon: "/announcement.svg" },
  { key: "products", icon: "/products.svg" },
  { key: "research", icon: "/research.svg", link: "https://www.kamcoinvest.com/research/type/all" },
  { key: "contact_us", icon: "/contact-us.svg" },
  { key: "security_tips", icon: "/security-tips.svg", type: "sheet" },
  { key: "kamco_website", icon: "/kamco-website.svg", link: "https://www.kamcoinvest.com/" },
  { key: "branches", icon: "/branches.svg", link: "https://www.kamcoinvest.com/content/our-network" },
];

const QuickActions = () => {
  const t = useTranslations();
  const [showSecuritySheet, setShowSecuritySheet] = useState(false); 
  const [showQrCode, setShowQrCode] = useState(false);

  return (
    <div className="w-full max-w-md mt-8">
      <div className="flex items-center justify-center mb-4">
        <div className="flex-grow h-px bg-gray-400 mx-2 opacity-50" />
        <span className="text-gray-400 text-sm font-medium">{t("quick_actions")}</span>
        <div className="flex-grow h-px bg-gray-400 mx-2 opacity-50" />
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap item-center justify-between gap-y-5">
          {actions.map((item, idx) => {
            const label = t(item.key);

            const button = (
              <div
                className="flex flex-col items-center justify-center"
                onClick={() => {
                  if (item.key === "security_tips") setShowSecuritySheet(true);
                  else if (item.key === "download_app") setShowQrCode(true);
                }}
              >
                <div className="cursor-pointer w-14 h-14 flex items-center justify-center bg-white rounded-xl mb-2.5 shadow-lg">
                  <img src={item.icon} alt={label} className="w-5 h-5" />
                </div>
                <div className="text-xs self-stretch text-center text-[#002f6c] font-['Montserrat'] font-semibold leading-none tracking-tight">
                  {label}
                </div>
              </div>
            );

            const content = item.link ? (
              <a href={item.link} target="_blank" rel="noreferrer">
                {button}
              </a>
            ) : (
              button
            );

            return (
              <div key={idx} className="w-[48%] md:w-[23%] items-center p-2">
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <SecurityTipsSheet open={showSecuritySheet} onOpenChange={setShowSecuritySheet} />
      <QRCodeModal open={showQrCode} onOpenChange={setShowQrCode} />
    </div>
  );
};

export default QuickActions;
