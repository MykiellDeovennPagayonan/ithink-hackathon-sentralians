import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/navbar';
// import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'AI Teaching Platform',
  description: 'Discover AI-powered learning experiences',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="mathjax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$']],
                  displayMath: [['$$', '$$']],
                  processEscapes: true,
                  processEnvironments: true,
                  packages: {'[+]': ['ams', 'newcommand', 'configmacros']}
                },
                svg: {
                  fontCache: 'global'
                },
                options: {
                  enableMenu: false,
                  menuOptions: {
                    settings: {
                      zoom: 'NoZoom'
                    }
                  }
                },
                startup: {
                  ready: () => {
                    console.log('MathJax is loaded and ready');
                    MathJax.startup.defaultReady();
                  }
                }
              };
            `,
          }}
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">
        {/* <AuthProvider> */}
          <Navbar />
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}