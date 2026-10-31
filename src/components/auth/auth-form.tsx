"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { homePathForRole } from "@/lib/auth/routes";
import { loginSchema, registerSchema, userRoleLabels, userRoles, type UserRole } from "@/lib/auth/validation";
import { cn } from "cn";

type AuthMode = "login" | "register";
type FieldName = "name" | "email" | "password" | "role";
type FieldErrors = Partial<Record<FieldName, string>>;

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);

    const values = {
      ...(isRegister
        ? {
            name: String(formData.get("name") ?? ""),
            role: String(formData.get("role") ?? ""),
          }
        : {}),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const schema = isRegister ? registerSchema : loginSchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as FieldName;
        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      toast.error("Please check your form details.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        });

        const data: { error?: string; user?: { role: UserRole }; warning?: string } = await response.json();

        if (!response.ok) {
          toast.error(data.error ?? "Registration failed.");
          return;
        }

        if (data.warning) {
          toast.warning(data.warning);
          router.replace("/login");
          return;
        }

        toast.success("Account created successfully!");
        const role = data.user?.role ?? "USER";
        router.replace(homePathForRole(role));
        router.refresh();
        return;
      }

      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password.");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role ?? "USER";

      toast.success("Welcome back!");
      router.replace(homePathForRole(role));
      router.refresh();
    } catch {
      toast.error("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">{isRegister ? "Register" : "Login"}</CardTitle>
        <CardDescription>
          {isRegister ? "Create your Criico account." : "Sign in to your Criico account."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-4">
            {isRegister && (
              <>
                <Field data-invalid={Boolean(errors.name)}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={100}
                    aria-invalid={Boolean(errors.name)}
                    required
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <Field data-invalid={Boolean(errors.role)}>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <select
                    id="role"
                    name="role"
                    defaultValue="USER"
                    aria-invalid={Boolean(errors.role)}
                    required
                    className={cn(
                      "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base dark:bg-input/30",
                      errors.role && "border-destructive ring-3 ring-destructive/20",
                    )}
                  >
                    {userRoles.map((role) => (
                      <option key={role} value={role}>
                        {userRoleLabels[role]}
                      </option>
                    ))}
                  </select>
                  {errors.role && <FieldError>{errors.role}</FieldError>}
                </Field>
              </>
            )}

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                required
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegister ? "At least 8 characters" : "Your password"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  aria-invalid={Boolean(errors.password)}
                  required
                  className="pr-10"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>

              {errors.password && <FieldError>{errors.password}</FieldError>}
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  {isRegister ? "Creating account…" : "Signing in…"}
                </>
              ) : isRegister ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
