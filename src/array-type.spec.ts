import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("Array Data Type Test Suite", () => {
  it("should pass for having exact lenght as defined", () => {
    const TestSchema = z.object({
      a: z.array(z.number()).length(3),
    });

    const test: z.infer<typeof TestSchema> = {
      a: [1, 2, 3],
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass for having minimum/maximum length", () => {
    const TestSchema = z.object({
      a: z.array(z.number()).min(1).max(3),
    });

    const test: z.infer<typeof TestSchema> = {
      a: [0, 8, 7],
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });

  it("should pass enum checks", () => {
    const TestSchema = z.object({
      list: z.enum(["1", "2", "3"]),
    });

    const test: z.infer<typeof TestSchema> = {
      list: "1",
    };

    expect(TestSchema.parse(test)).toEqual(test);
  });
});
