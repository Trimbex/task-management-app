import Link from "next/link";

const SECTIONS = [
  { href: "/tasks", title: "Task Dashboard", text: "Browse tasks and mark them done." },
  { href: "/activity", title: "Activity Feed", text: "Search the latest activity." },
  { href: "/reports", title: "Reports", text: "See task and activity totals." },
];

export default function HomePage() {
  return (
    <main className="stack">
      <header className="page-header">
        <h1>Task Manager</h1>
        <p>Track tasks, review activity and see a summary report.</p>
      </header>

      <section className="grid-cards">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="card">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
