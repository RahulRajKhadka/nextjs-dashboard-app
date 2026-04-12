import Link from "next/link";

export default function Home() {
  const tasks = [
    {
      id: 1,
      label: "Task 1",
      description: "SkillShikshya Journey UI",
      href: "/task1",
      bg: "#D94F3D",
    },
    {
      id: 2,
      label: "Task 2",
      description: "Courses Dashboard UI",
      href: "/task2",
      bg: "#2E9E6B",
    },
    {
      id: 3,
      label: "Task 3",
      description: "User & Posts Dashboard",
      href: "/task3",
      bg: "#3B6FD4",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-[#f5f5f5] px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">SkillShikshya</h1>
        <p className="text-gray-500 mt-2 text-lg">Frontend Task Submission</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {tasks.map((task) => (
          <Link key={task.id} href={task.href}>
            <div
              className="w-64 h-40 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
              style={{ backgroundColor: task.bg }}
            >
              <span className="text-2xl font-bold">{task.label}</span>
              <span className="text-sm mt-2 opacity-80 text-center px-4">
                {task.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}