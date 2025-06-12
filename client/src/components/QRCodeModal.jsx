'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQRCode } from 'next-qrcode';
import { useTranslations } from "next-intl";
export default function QRCodeModal({ open, onOpenChange }) {
  const { Canvas } = useQRCode();

  const qrValue =
    "https://www.youtube.com/watch?time_continue=1&v=dQw4w9WgXcQ&embeds_referring_euri=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Drickroll%26rlz%3D1C1GCEU_enIN1161IN1161%26oq%3Drickroll%26gs_lcrp%3DEgZjaHJvbWUyDggAEEUYORhDGIAEGIoFMgwIARAA&source_ve_path=Mjg2NjY";
  const t = useTranslations();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-apple font-bold">{t("qr_title")}</DialogTitle>
          <DialogDescription className="text-center font-['Monteserra'] text-xl text-gray-600 mt-2">
            {t("qr_description")}
          </DialogDescription>
        </DialogHeader>


        <div className="mt-6 flex justify-center">
          <div className="p-[3px] bg-[#002f6c] rounded-xl">
            <div className="bg-white p-2 rounded-md">
              <Canvas
                text={qrValue}
                options={{
                  errorCorrectionLevel: 'H',
                  margin: 0,
                  width: 128,
                  color: {
                    dark: '#002f6c', 
                    light: '#ffffff',
                  },
                }}
                />
            </div>
          </div>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-lg"
        >
          {t("close")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
