import { dehydrate, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "~/lib/orpc";
import type { Route } from "./+types/_index";
import { getQueryClient } from "~/lib/query-client";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=60",
  };
}

export async function loader({ context }: Route.LoaderArgs) {
  // if need to use orpc client in loader, use context.client
  // const planets = await context.client.planet.list({});
  // console.log("planets :>> ", planets);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpc.planet.list.queryOptions({ input: {} }));

  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    dehydratedState: dehydrate(queryClient),
  };
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An error occurred while loading the planets.";

  if (error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0 max-w-[600px] w-full px-4">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">{message}</h1>
            <p className="text-red-700 dark:text-red-300">{details}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data: planets } = useQuery(
    orpc.planet.list.queryOptions({
      input: {},
    })
  );

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-3xl font-bold">Planets {loaderData.message}</h1>
        </header>
        <div className="max-w-[600px] w-full space-y-6 px-4">
          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">Planet List</p>
            <ul className="space-y-2">
              {planets?.map((planet, index) => (
                <li key={index} className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                  <div className="text-gray-900 dark:text-gray-100">
                    {typeof planet === "string" ? planet : JSON.stringify(planet)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
