import { Container } from "@/components/shared/container";
import PropertyFilters from "../_component/propertyFilters";
import PropertyListings from "../_component/PropertyListings";

export default function PropertiesPage() {
  return (
    <Container className="px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8 text-foreground">
        Available Properties
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Left Sidebar: Filters */}
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <PropertyFilters />
        </aside>

        {/* Right Content: Listings */}
        <main>
          <PropertyListings />
        </main>
      </div>
    </Container>
  );
}
