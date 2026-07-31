import PropertyDetails from "../../_component/propertyDetails";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PropertyDetails id={id} />;
}
