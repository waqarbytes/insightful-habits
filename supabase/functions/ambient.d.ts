// Explicitly declare Deno global to silence TypeScript errors
// when the editor configuration fails to load Deno types automatically.

declare namespace Deno {
    export interface Env {
        get(key: string): string | undefined;
    }

    export const env: Env;

    export function serve(handler: (req: Request) => Promise<Response>): void;
}
