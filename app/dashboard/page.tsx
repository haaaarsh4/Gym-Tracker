// app/dashboard/page.tsx
import { requireUser } from "@/app/lib/hooks";
import DashboardContent from "@/app/components/DashboardContent";
import { getDashboardStats } from "@/app/lib/dashboardData";

export default async function DashboardPage() {
  const session = await requireUser();
  
  // Fetch dashboard stats
  const stats = await getDashboardStats(session.user?.id as string);

  return <DashboardContent stats={stats} />;
}