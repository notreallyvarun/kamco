 import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tips = [
  {
    title: "Use a Secure Connection",
    description:
      "Always connect to the internet through a secure and trusted network, preferably a private Wi-Fi connection or cellular data. Avoid using public Wi-Fi networks for sensitive transactions.",
  },
  {
    title: "Update the App Regularly",
    description:
      "Keep your app and device software up to date to ensure you have the latest security patches. Updates often fix vulnerabilities that attackers can exploit, so enable automatic updates whenever possible.",
  },
  {
    title: "Enable App Lock and Biometric Authentication",
    description:
      "Use app locks and biometric features like fingerprint or face recognition to add a second layer of security. This ensures only authorized users can access your sensitive information even if the device is unlocked.",
  },
  {
    title: "Beware of Phishing Attempts",
    description:
      "Be cautious of emails, messages, or calls requesting personal information. Always verify the source before clicking links or downloading attachments. Legitimate organizations will never ask for passwords via email.",
  },
  {
    title: "Secure Your Device",
    description:
      "Set strong device passwords or PINs and enable features like screen lock and automatic timeout. Avoid jailbreaking or rooting your device, which can expose it to security threats.",
  },
  {
    title: "Review Account Activity Regularly",
    description:
      "Frequently check your account activity for suspicious transactions or logins. Most platforms allow you to review login history or receive alerts for unusual behavior—take advantage of these tools.",
  },
  {
    title: "Logout After Each Session",
    description:
      "Always log out of your accounts after completing your session, especially on shared or public devices. This prevents unauthorized access if someone else uses the device after you.",
  },
  {
    title: "Educate Yourself on Security Features",
    description:
      "Stay informed about built-in security tools and features offered by your apps and devices. Understanding these can help you take full advantage of protective measures like encryption, 2FA, and account recovery.",
  },
  {
    title: "Keep Personal Information Secure",
    description:
      "Avoid sharing personal details such as your address, phone number, or financial information unless absolutely necessary. Be cautious about the permissions you grant to apps, especially those that access your contacts or location.",
  },
  {
    title: "Install Security Software",
    description:
      "Use reputable antivirus or security apps to detect and remove malware. These tools often offer real-time protection, safe browsing alerts, and regular scans to keep your device clean.",
  },
  {
    title: "Be Cautious with Public Devices",
    description:
      "Avoid accessing sensitive accounts from public or shared computers. If you must use them, enable incognito mode, avoid saving passwords, and log out of all services before leaving the device.",
  },
];

export default function SecurityTipsSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-90vw !max-w-[600px] !sm:w-[600px] overflow-y-auto max-h-screen
      [&>button]:h-5 [&>button]:w-5 [&>button]:text-3xl [&>button]:text-gray-800">
        <SheetHeader className="text-center p-7 pb-1">
          <SheetTitle className="text-2xl font-bold">Security Tips</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <Accordion type="multiple" collapsible className="w-full">
            {tips.map((tip, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="mb-2 rounded-2xl p-2 mb-2 shadow-lg border-2 border-stone-200 bg-white">
                <AccordionTrigger className="flex justify-between items-center px-4 py-3 text-left font-semibold cursor-pointer text-base text-[#002D72]">
                  {tip.title}
                  <span className="ml-2 cursor-pointer inline-flex items-center justify-center h-6 w-6 rounded-md text-sm font-bold text-gray-800">
                    <span className="block group-data-[state=open]:hidden">
                      <img src="./plus-blue.svg" alt="plus" />
                    </span>
                    <span className="hidden hidden group-data-[state=open]:inline">
                      <img src="./minus-blue.svg" alt="minus" />
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 px-4 pt-2 pb-4 ">
                  {tip.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
