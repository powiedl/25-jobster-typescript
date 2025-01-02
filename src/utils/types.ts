import * as z from 'zod';

// #region register
export const registerSchema = z
  .object({
    isMember: z.boolean().optional(),
    name: z.string().optional(),
    email: z.string().email('email must be a valid email address.'),
    password: z
      .string()
      .min(6, {
        message: 'password must be at least 6 characters.',
      })
      .max(20, { message: 'password must be at most 20 characters.' }),
  })
  .refine(
    (schema) => {
      if (schema?.isMember) return z.OK;
      if (schema.name && schema.name.length > 1) {
        return z.OK;
      } else {
        return false;
      }
    },
    { message: 'name must be at least 2 characters.', path: ['name'] }
  );

export type registerSchemaType = z.infer<typeof registerSchema>;
export type RegisterFormType = {
  name?: string;
  email: string;
  password: string;
  isMember: boolean;
};
// #endregion register

// #region profile
export const profileSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 characters.'),
  email: z.string().email('email must be a valid email address.'),
  lastName: z.string().min(2, 'last name must be at least 2 characters.'),
  location: z.string().min(2, 'location must be at least 2 characters.'),
});

export type profileSchemaType = z.infer<typeof profileSchema>;

export type ProfileFormType = {
  name: string;
  email: string;
  lastName: string;
  location: string;
};
// #endregion profile
