import { ReactElement, ReactNode, useState } from 'react';

// global styles
import '../styles/globals.css';
import '../scss/style.scss';

// calendar - styles
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

// next
import { NextPage } from 'next';
import type { AppProps } from 'next/app';

// third-party
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project-import
import { persister, store } from '../store';
import ThemeCustomization from '../themes';
import { ConfigProvider } from '../contexts/ConfigContext';
import NavigationScroll from '../layout/NavigationScroll';
import Locales from 'ui-component/Locales';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';

import { SupabaseProvider as AuthProvider } from 'contexts/SupabaseContext';
import { withTRPC } from '@trpc/next';
import { AppRouter } from 'pages/api/trpc/[trpc]';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// import { Auth0Provider as AuthProvider } from '../contexts/Auth0Context';
// import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
}

function MyApp({ Component, pageProps }: AppProps & Props) {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <ConfigProvider>
          <ThemeCustomization>
            <RTLLayout>
              <Locales>
                <NavigationScroll>
                  <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
                    <AuthProvider>
                      <>
                        {getLayout(<Component {...pageProps} />)}
                        <Snackbar />
                      </>
                    </AuthProvider>
                  </SessionContextProvider>
                </NavigationScroll>
              </Locales>
            </RTLLayout>
          </ThemeCustomization>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const env = process.env.NODE_ENV;
    const url = env === 'development' ? 'http://localhost:3000/api/trpc' : `${process.env.VERCEL_URL}/api/trpc`;
    return {
      url
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true
})(MyApp);
