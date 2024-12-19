import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

describe("Primitive Data Types Test Suite", () => {
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
