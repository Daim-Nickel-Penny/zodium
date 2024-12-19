import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

describe("Primitive Data Types", () => {
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

  it("should pass list checks", () => {
    const TestSchema = z.object({
      list: z.enum(["1", "2", "3"]),
    });

    const test: z.infer<typeof TestSchema> = {
      list: "1",
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass for partial from schema", () => {
    const TestSchema = z
      .object({
        a: z.string(),
      })
      .partial();

    const test: z.infer<typeof TestSchema> = {};

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass for pick and omit from schema", () => {
    const TestSchema = z
      .object({
        a: z.string(),
        b: z.number(),
        c: z.boolean(),
      })
      .pick({
        a: true,
        b: true,
      })
      .omit({
        a: true,
      });

    const test: z.infer<typeof TestSchema> = {
      b: 0,
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass for extending the schema", () => {
    const TestSchema = z
      .object({
        a: z.string(),
        b: z.number(),
        c: z.boolean(),
      })
      .extend({
        d: z.string(),
      });

    const test: z.infer<typeof TestSchema> = {
      a: "1",
      b: 1,
      c: true,
      d: "2",
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass for merging two schemas", () => {
    const TestSchema = z.object({
      a: z.string(),
      b: z.number(),
      c: z.boolean(),
    });

    const TestSchema_2 = z
      .object({
        d: z.string(),
        e: z.boolean(),
      })
      .merge(TestSchema);

    const test: z.infer<typeof TestSchema_2> = {
      a: "1",
      b: 1,
      c: true,
      d: "2",
      e: false,
    };

    expect(TestSchema_2.parse(test)).toEqual(test);
  });

  it("should pass through keys not defined in schema", () => {
    const TestSchema = z
      .object({
        a: z.string(),
      })
      .passthrough();

    const test: z.infer<typeof TestSchema> & { b: number } = {
      a: "1",
      b: 1,
    };

    //zod removes missing keys after parsing but if pass through added it adds them

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass through keys not defined in schema", () => {
    const TestSchema = z
      .object({
        a: z.string(),
      })
      .strict();

    const test: z.infer<typeof TestSchema> & { b: number } = {
      a: "1",
      b: 1,
    };

    /**
     * - if nothing added it will remove not mentioned key against schema
     * - if **passthrough** adds the key missing in schema
     * - if **Strict** will throw error
     */

    expect(() => TestSchema.parse(test)).throw();
  });
});
