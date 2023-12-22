import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import Providers from "@/auth/Providers";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { DatesProvider } from "@mantine/dates";

export const metadata: Metadata = {
  title: "My Wallet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <DatesProvider
            settings={{
              timezone: "Etc/GMT-2",
            }}
          >
            <Providers>{children}</Providers>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
