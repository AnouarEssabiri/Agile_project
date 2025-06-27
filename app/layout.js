import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { AuthProvider } from "@/hooks/useAuth"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 