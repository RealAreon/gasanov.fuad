import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-store'
import { WishlistProvider } from '@/lib/wishlist-store'
import { CartSidebar } from '@/components/cart-sidebar'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CHRONOS | Преміум Годинники в Україні',
  description: 'Ексклюзивна колекція преміум годинників. Час визначає статус. Безкоштовна доставка по Україні.',
  keywords: ['годинники', 'преміум', 'Україна', 'люкс', 'часи'],
  icons: {
    icon: '/logo-mark.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uk"
      className={`${cormorant.variable} ${jakarta.variable} bg-background scroll-smooth`}
    >
      <body className="font-sans antialiased">
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartSidebar />
          </WishlistProvider>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
