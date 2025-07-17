import FormModal from "@/components/FormModal";
import Image from "next/image";
import { getUsers } from "@/lib/data";
import { format } from "timeago.js";
import { UserType } from "@/types/types";
import { auth } from "@/lib/auth";
import AdminSearch from "@/components/AdminSearch";
import AdminPagination from "@/components/AdminPagination";

const AdminUsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) => {
  const page = Number((await searchParams).page) || 1;
  const search = (await searchParams).search || "";
  const session = await auth();

  const { users, totalUsers }: { users: UserType[]; totalUsers: number } =
    await getUsers(page, search, session?.user?.id);

  return (
    <div className="bg-bgSoft p-5 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <AdminSearch placeholder="Search for a user..." />
        <FormModal table="user" type="create" />
      </div>
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th>Name</th>
            <th className="hidden lg:table-cell">Username</th>
            <th className="hidden xl:table-cell">Email</th>
            <th className="hidden lg:table-cell">Admin</th>
            <th className="hidden md:table-cell">Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="flex items-center gap-2">
                  <Image
                    src={user.image || "/noavatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  {user.name}
                </div>
              </td>
              <td className="hidden lg:table-cell">{user.username}</td>
              <td className="hidden xl:table-cell">{user.email}</td>
              <td className="hidden lg:table-cell">
                {user.isAdmin ? "true" : "false"}
              </td>
              <td className="hidden md:table-cell">{format(user.createdAt)}</td>
              <td>
                <div className="flex gap-2">
                  <FormModal table="user" type="update" data={user} />
                  <FormModal table="user" type="delete" id={user._id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminPagination totalData={totalUsers} />
    </div>
  );
};

export default AdminUsersPage;
