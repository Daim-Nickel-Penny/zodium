import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

describe("Primitive Data Types Test Suite", () => {
  beforeAll(() => {});

  it("should be matching schema", () => {
    const UserSchema = z.object({
      username: z.string(),
    });

    type User = z.infer<typeof UserSchema>;

    const user: User = {
      username: "foo",
    };

    const parse = UserSchema.parse(user);
    console.log(parse);

    expect(parse).toEqual(user);
  });

  it("should not be matching schema", () => {
    const UserSchema = z.object({
      username: z.string(),
    });

    const user = {
      username: 1,
    };

    expect(() => UserSchema.parse(user)).toThrow();
  });

  it("should safe parse the matching schema", () => {
    const UserSchema = z.object({
      username: z.string(),
    });

    const user = {
      username: "foo",
    };

    const parse = UserSchema.safeParse(user);

    console.log(parse); //{ success: true, data: { username: 'foo' } }

    expect(parse.success).toBeTruthy();
  });

  it("should parse more basic types", () => {
    const RandomDataSchema = z.object({
      a: z.number(),
      b: z.bigint().optional(),
      date: z.date(),
      isCool: z.boolean(),
      undef: z.undefined(),
      nothing: z.null(),
      vod: z.void(),
    });

    //get interface out of zod schema
    interface RandomData extends z.infer<typeof RandomDataSchema> {}

    const randomData: RandomData = {
      a: 1,
      date: new Date(),
      isCool: false,
      undef: undefined,
      nothing: null,
      vod: undefined,
    };

    // console.log("Schema logs");
    // console.log(RandomDataSchema.shape.a);

    const parse = RandomDataSchema.parse(randomData);

    expect(parse).toEqual(randomData);
  });

  it("should pass string checks", () => {
    const TestSchema = z.object({
      a: z.string().min(0).max(5).default(""),
    });

    const test: z.infer<typeof TestSchema> = {
      a: "",
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });
});
