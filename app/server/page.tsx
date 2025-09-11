import Home from "./inner";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ServerPage() {
  const preloaded = await preloadQuery(api.myFunctions.getTweets, {
    limit: 3,
  });

  const data = preloadedQueryResult(preloaded);

  return (
    <main className="min-h-screen bg-black text-white font-mono p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Server data</h1>
          <p className="text-gray-300 text-sm">
            Non-reactive, preloaded via Convex + Next.js
          </p>
        </header>
        <div className="flex flex-col gap-4 border border-gray-800 rounded p-4">
          <h2 className="text-xl font-bold">Non-reactive server-loaded data</h2>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <Home preloaded={preloaded} />
      </div>
    </main>
  );
}
