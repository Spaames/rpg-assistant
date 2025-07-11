"use client";

import "./globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <div className="app-container">
              {children}
            </div>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
