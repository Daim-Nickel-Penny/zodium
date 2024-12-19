# Zodium

Collection of quick scripts for **Zod**

Will be adding **vitest** soon.

# Quick Snippets

- **Get interface and type out of zod schema**

  ```ts
  interface RandomData extends z.infer<typeof RandomDataSchema> {}
  ```

  ```ts
  type User = z.infer<typeof UserSchema>;
  ```
