import AdminNav from './_components/AdminNav';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-dvh bg-[#F8FAFC]">
      <AdminNav />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
