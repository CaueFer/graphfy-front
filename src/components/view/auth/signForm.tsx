import { ComponentPropsWithoutRef, useState } from "react";
import { EyeClosed, Eye, Grape } from "lucide-react";

import GoogleSvg from "@/components/svg/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { post } from "@/lib/helpers/fetch.helper";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { clientCookie } from "@/lib/hooks/getClientCookie";
import { useRouter } from "next/navigation";
import SpinnerSvg from "@/components/svg/spinner";

export function SignupForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { toast } = useToast();
  const cookie = clientCookie();

  const [showPassword, setShowPassword] = useState(false);

  const [logged, setLogged] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handleSignup = (formData: FormData) => {
    setLogged(false);
    setisLoading(true);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    post("/auth/signup", {
      username,
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

          setLogged(true);

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

        setLogged(false);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={handleSignup}>
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
              Já tem conta?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>

          {/* INPUTS */}
          <div className="flex flex-col gap-6 h-[300px]">
            {/* NOME */}
            <div className="grid gap-2">
              <Label htmlFor="username">Nome</Label>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Seu nome..."
                required
                className="autofill:bg-background"
                disabled={logged}
              />
            </div>

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
                disabled={logged}
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
                  required
                  minLength={6}
                  disabled={logged}
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
              {isLoading ? (
                <>
                  <SpinnerSvg /> Carregando...
                </>
              ) : (
                "Criar"
              )}
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
