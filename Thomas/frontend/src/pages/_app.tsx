import 'public/assets/global-css/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { appWithTranslation } from 'next-i18next'

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider themes={['light', 'dark']} disableTransitionOnChange>
    <Component {...pageProps} />
  </ThemeProvider>
)

export default appWithTranslation(App /*, nextI18NextConfig */);