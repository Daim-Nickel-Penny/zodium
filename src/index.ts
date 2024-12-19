import { z } from "zod";

const UserSchema = z.object({
  username: z.string(),
});

const user = {
  username: 1,
};
