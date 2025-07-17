import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="border border-borderColor rounded-lg p-5 flex flex-col">
        <RegisterForm />
        <Link href="/login" className="text-sm text-red-500 underline mt-2">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
