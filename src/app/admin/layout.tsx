import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-bg sticky top-0 z-50 w-full">
        <div className="max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5">
          <Navbar />
        </div>
      </div>
      <div className="flex">
        <Sidebar />
        <div className="w-full px-5 lg:px-10">{children}</div>
      </div>
    </>
  );
}
