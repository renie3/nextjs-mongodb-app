import ProfileUpdateForm from "@/components/forms/ProfileUpdateForm";
import { auth } from "@/lib/auth";

const UpdateUserPage = async () => {
  const session = await auth();

  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="border border-borderColor rounded-lg p-5 flex flex-col">
        <ProfileUpdateForm session={session} />
      </div>
    </div>
  );
};

export default UpdateUserPage;
