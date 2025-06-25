// app/dashboard/page.tsx
import { requireUser } from "../lib/hooks";
import DashboardContent from "@/app/components/DashboardContent";

export default async function DashboardPage() {
  const session = await requireUser();
  
  return <DashboardContent />;
  //return(<></>)
}