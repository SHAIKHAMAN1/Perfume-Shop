import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getTasksForPage } from "@/lib/tasks";

export const dynamic = "force-dynamic";

function StatusBadge({ status }) {
  const styles =
    status === "done"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
      : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200";

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

export default async function Home() {
  const { configured, tasks, stats, error } = await getTasksForPage();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between gap-10 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
              MongoDB + Next.js
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              This page reads from a <code className="text-sm">tasks</code>{" "}
              collection using the cached MongoDB client pattern recommended by
              the MongoDB plugin&apos;s connection skill.
            </p>
          </div>

          <section className="w-full rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Task board
              </h2>
              {stats ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stats.done} done · {stats.todo} todo · {stats.total} total
                </p>
              ) : null}
            </div>

            {!configured ? (
              <div className="space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <p>
                  MongoDB is not configured yet. Copy{" "}
                  <code>.env.example</code> to <code>.env.local</code>, start
                  the database, then seed sample data:
                </p>
                <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  {`docker compose up -d
npm run db:seed`}
                </pre>
              </div>
            ) : error ? (
              <div className="space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <p className="text-amber-700 dark:text-amber-300">
                  Connected config found, but MongoDB is unreachable: {error}
                </p>
                <p>Start the local database and seed tasks:</p>
                <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  {`docker compose up -d
npm run db:seed`}
                </pre>
              </div>
            ) : tasks.length === 0 ? (
              <div className="space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <p>Database is reachable but empty. Seed sample tasks:</p>
                <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  npm run db:seed
                </pre>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tasks.map((task) => (
                  <li
                    key={task._id.toString()}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">
                      {task.title}
                    </span>
                    <StatusBadge status={task.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button render={<a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" />}>
            Deploy Now
          </Button>
          <Button
            variant="outline"
            render={
              <a
                href="https://www.mongodb.com/docs/drivers/node/current/"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            MongoDB Node Driver
          </Button>
        </div>
      </main>
    </div>
  );
}
