// app/dashboard/page.tsx
import { requireUser } from "@/app/lib/hooks";
import DashboardContent from "@/app/components/DashboardContent";
import { getDashboardStats, getAnalyticsData } from "@/app/lib/dashboardData";

export default async function DashboardPage() {
  const session = await requireUser();
  
  // Fetch both dashboard stats and analytics data
  const stats = await getDashboardStats(session.user?.id as string);
  const analytics = await getAnalyticsData(session.user?.id as string);

  return <DashboardContent stats={{ ...stats, analytics }} />;
}