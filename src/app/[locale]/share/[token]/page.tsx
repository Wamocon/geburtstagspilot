import { ShareViewPage } from "@/components/share/ShareViewPage";

export default async function SharedPlanPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { token } = await params;
  return <ShareViewPage token={token} />;
}
