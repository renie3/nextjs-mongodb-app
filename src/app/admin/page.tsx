import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return <div>AdminPage</div>;
};
export default AdminPage;
