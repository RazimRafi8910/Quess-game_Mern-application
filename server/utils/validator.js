import { z, ZodError } from "zod";

export const loginBodySchema = z.object({
  email: z.email({error:"invalid email"}).min(1,{error:"email is required"}),
  password: z.string().min(8, {error:"password is required"}),
});

export const regiesterBodySchema = z.object({
    username:z.string().min(3,"username should be atleast 3 characters").max(10,"username should be with in 10 characters"),
    email: z.email("invalid email").min(1,"email required"),
    password: z
    .string()
    .min(8,"Password must be atlead 8 characters")
    .regex('/[A-Z]/')
})

export function validate(schema, data) {
  try {
    return { ok: true, data: schema.parse(data) };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        ok: false,
        status: 422,
        message: err.issues?.[0]?.message ?? "invalid request",
        issues: err.issues,
      };
    }
    return { ok: false, status: 500, message: "validation failed" };
  }
}
