import { handleLogout } from "@/lib/actions/userActions";

const LogoutButton = () => {
  return (
    <form className="flex-1" action={handleLogout}>
      <button className="w-full p-1 bg-green-700 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed">
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;
