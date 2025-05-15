import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <div className={"flex flex-col h-full items-center justify-center"}>
      <SignIn />
    </div>
  );
}
