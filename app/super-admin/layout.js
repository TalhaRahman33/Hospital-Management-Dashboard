import SuperAdminLayout from './components/SuperAdminLayout';

export const metadata = {
  title: 'Super Admin Dashboard',
  description: 'Administrative dashboard for hospital management',
};

export default function SuperAdminRootLayout({ children }) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
