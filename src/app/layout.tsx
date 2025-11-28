import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from "react-hot-toast";


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children} <Toaster
            position="top-right"
            containerStyle={{
              top: "100px", // adjust according to navbar height
              right: "20px",
              zIndex: 9999,
            }}
          />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
