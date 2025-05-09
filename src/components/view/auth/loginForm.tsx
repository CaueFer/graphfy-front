import { ComponentPropsWithoutRef, useState } from "react";
import { EyeClosed, Eye, Grape } from "lucide-react";

import GoogleSvg from "@/components/svg/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { clientCookie } from "@/lib/hooks/getClientCookie";
import { post } from "@/lib/helpers/fetch.helper";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const cookie = clientCookie();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    post("/auth/login", {
      email,
      password,
    })
      .then(async (res: Response) => {
        const data = await res.json();

        if (res.ok) {
          toast({
            description: data.message,
            variant: "default",
          });

          cookie.set("token", data.token);
          router.push("/chat");
        }

        if (res.status >= 400) {
          toast({
            description: data.detail,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Grape className="size-6" />
              </div>
              <span className="sr-only">Graphfy Logo</span>
            </Link>
            <h1 className="text-xl font-bold">Bem vindo ao Graphfy</h1>
            <div className="text-center text-sm">
              Não tem conta?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Criar
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* EMAIL */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Seu melhor email..."
                required
                className="autofill:bg-background"
              />
            </div>

            {/* SENHA */}
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Sua senha..."
                  minLength={6}
                  required
                />
                <Button
                  type="button"
                  size={"sm"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              OU
            </span>
          </div>

          {/* OAUTH */}
          <div className="flex flex-row">
            <Button variant="outline" type="button" className="w-full mx-5">
              <GoogleSvg />
              Continuar com Google
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        Seus dados não serão usados para <br /> treinamento de modelos.
      </div>
    </div>
  );
}
