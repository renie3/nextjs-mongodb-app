import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-bg sticky top-0 z-50 w-full">
        <div className="max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5">
          <Navbar />
        </div>
      </div>
      <div className="flex-1 max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5 w-full">
        {children}
      </div>
      <div className="max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5 w-full">
        <Footer />
      </div>
    </div>
  );
}
