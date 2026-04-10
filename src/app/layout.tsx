import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#a78bfa',
          colorBackground: 'rgb(20, 20, 30)',
          colorInputBackground: 'rgb(26, 26, 40)',
          colorInputText: 'rgb(237, 237, 240)',
          borderRadius: '0.75rem',
        },
      }}
    >
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}