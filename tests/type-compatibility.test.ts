import {execFileSync} from "node:child_process"
import {existsSync} from "node:fs"
import {join} from "node:path"
import {expect} from "@jest/globals"

describe("Type compatibility", () => {
  test("middy middleware list accepts injectLambdaContext with strict TS", () => {
    const tscPath = join(process.cwd(), "node_modules", "typescript", "bin", "tsc")
    const fixturePath = join("tests", "fixtures", "middy-powertools-compat.ts")

    expect(existsSync(tscPath)).toBe(true)

    const compileFixture = () => {
      execFileSync(process.execPath, [
        tscPath,
        "--ignoreConfig",
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        "--target",
        "ES2022",
        "--moduleResolution",
        "NodeNext",
        "--module",
        "NodeNext",
        fixturePath
      ], {
        cwd: process.cwd(),
        stdio: "pipe"
      })
    }

    try {
      compileFixture()
    } catch (error) {
      const stderr = String((error as {stderr?: Buffer}).stderr ?? "")
      const stdout = String((error as {stdout?: Buffer}).stdout ?? "")
      const wrappedError = Object.assign(
        new Error(
          [
            "Strict TypeScript compatibility check failed for tests/fixtures/middy-powertools-compat.ts",
            stdout.trim(),
            stderr.trim()
          ].filter(Boolean).join("\n\n")
        ),
        {cause: error}
      )

      throw wrappedError
    }
  })
})
