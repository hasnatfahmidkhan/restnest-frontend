import { Container } from "@/components/shared/container";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

const PublicLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

export default PublicLayout;
