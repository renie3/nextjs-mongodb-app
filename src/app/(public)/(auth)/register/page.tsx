import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="border border-borderColor rounded-lg p-5 flex flex-col">
        <RegisterForm />
        <span className="text-sm text-textSoft mt-3">
          Do you have an account?
          <Link href="/login" className="ml-1 font-bold">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default RegisterPage;
