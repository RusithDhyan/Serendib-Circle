import AdminLayoutClient from './AdminLayoutClient';
import { DataProvider } from '../context/DataContext';
import { fetchAllData } from '@/lib/fetchData';

export default async function SiteAdminLayout({ children }) {
  const initialData = await fetchAllData();

  // console.log("SERVER hotels:", initialData?.hotels); // 👈 debug

  return (
    <DataProvider initialData={initialData}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </DataProvider>
  );
}
