import FormLogin from "./Form";
import { ThemeToggle } from "../ThemeToggle";

const LoginContainer = () => {
  return (
    <div className="w-full flex h-full items-center justify-center">
      <div className="flex flex-col w-full text-start justify-center h-full">
        <FormLogin />
      </div>
      <div className="absolute bottom-10 left-10">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LoginContainer;
