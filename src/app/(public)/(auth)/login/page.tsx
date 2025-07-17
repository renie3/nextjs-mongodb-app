import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  handleGithubLogin,
  handleGoogleLogin,
} from "@/lib/actions/userActions";

const LoginPage = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="border border-borderColor rounded-lg p-5 flex flex-col">
        <LoginForm />
        <h1 className="text-center mb-3 mt-1">or</h1>
        <form action={handleGoogleLogin}>
          <button className="p-3 bg-slate-100 dark:bg-white text-black rounded-md w-full flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
            <FcGoogle size={20} /> Signin with Google
          </button>
        </form>
        <form action={handleGithubLogin} className="mt-3">
          <button className="p-3 bg-slate-100 dark:bg-white text-black rounded-md w-full flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
            <FaGithub size={20} /> Signin with Github
          </button>
        </form>
        <Link href="/register" className="text-sm text-red-500 underline mt-2">
          Go to Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
