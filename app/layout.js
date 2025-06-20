import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  )
} 