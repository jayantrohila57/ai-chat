import { KeyRound, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PATH } from "@/shared/config/routes";

const sections = [
  {
    title: "Sign In",
    description: "Access the AI chat starter and pick up from your saved account state.",
    icon: <LogIn className="text-primary h-6 w-6" />,
    href: PATH.AUTH.SIGN_IN,
  },
  {
    title: "Sign Up",
    description: "Create your account before the conversation layer is built on top of the starter.",
    icon: <UserPlus className="text-primary h-6 w-6" />,
    href: PATH.AUTH.SIGN_UP,
  },
  {
    title: "Forgot Password",
    description: "Reset access and get back into the AI chat starter quickly.",
    icon: <KeyRound className="text-primary h-6 w-6" />,
    href: PATH.AUTH.FORGOT_PASSWORD,
  },
];

export const AuthPageComponent = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      {sections.map((section) => (
        <Link key={section.title} href={section.href}>
          <Card className="shadow-none transition-shadow hover:shadow">
            <CardHeader className="py-0">
              <CardTitle>{section.title}</CardTitle>
              <CardDescription className="max-w-72">{section.description}</CardDescription>
              <CardAction>{section.icon}</CardAction>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};
