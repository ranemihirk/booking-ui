import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../styles/global.css";
import DefaultContextProvider from "@/contexts/DefaultContext";
import AuthContextProvider from "@/contexts/AuthContext";
import ToastContextProvider from "@/contexts/ToastContext";
import CalendarContextProvider from "@/contexts/CalendarContext";
import { ToastContainer } from "react-toastify";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking App",
  description: "Developed by Mihir Rane.",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col dark:bg-custom-gradient">
        <DefaultContextProvider>
          <AuthContextProvider>
            <ToastContextProvider>
              <CalendarContextProvider>
                <Header />
                <main className="grow">{children}</main>
                <Footer />
                <ToastContainer />
              </CalendarContextProvider>
            </ToastContextProvider>
          </AuthContextProvider>
        </DefaultContextProvider>
      </body>
    </html>
  );
}
