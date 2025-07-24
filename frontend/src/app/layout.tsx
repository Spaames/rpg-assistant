"use client";

import "./globals.css";
import { Provider } from "react-redux";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>RPG Assistant</title>
        <meta name="description" content="A tool to assist with RPG games." />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
