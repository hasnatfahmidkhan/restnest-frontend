import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

const PublicLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
