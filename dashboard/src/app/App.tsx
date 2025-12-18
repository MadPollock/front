import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardView } from './views/DashboardView';
import { AnalyticsView } from './views/AnalyticsView';
import { TransactionsView } from './views/TransactionsView';
import { AccountsView } from './views/AccountsView';
import { WithdrawView } from './views/WithdrawView';
import { WhitelistView } from './views/WhitelistView';
import { AddUserView } from './views/AddUserView';
import { TemplatesView } from './views/TemplatesView';
import { SettingsView } from './views/SettingsView';

// Auth0 configuration with safe defaults
const auth0Config = {
  domain: import.meta.env?.VITE_AUTH0_DOMAIN || 'demo.auth0.com',
  clientId: import.meta.env?.VITE_AUTH0_CLIENT_ID || 'demo-client-id',
  audience: import.meta.env?.VITE_AUTH0_AUDIENCE,
};

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const renderView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'accounts':
        return <AccountsView />;
      case 'withdraw':
        return <WithdrawView />;
      case 'whitelist':
        return <WhitelistView />;
      case 'add-user':
        return <AddUserView />;
      case 'templates':
        return <TemplatesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Config.audience,
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <DashboardLayout activeNav={activeNav} onNavChange={setActiveNav}>
            {renderView()}
          </DashboardLayout>
        </AuthProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
}