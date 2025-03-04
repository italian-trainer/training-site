import { Link } from "react-router-dom";

const trainingModules = {
  server: [
    { id: "module1", title: "Server Training 1" },
    { id: "module2", title: "Server Training 2" },
  ],
  cashier: [
    { id: "module1", title: "Cashier Training 1" },
    { id: "module2", title: "Cashier Training 2" },
  ],
};

export default function TableOfContents({ role }) {
  return (
    <div className="w-1/4 p-4 border-r">
      <h2 className="text-xl font-semibold mb-4">Training Modules</h2>
      <ul>
        {trainingModules[role]?.map(module => (
          <li key={module.id} className="mb-2">
            <Link className="text-blue-500 hover:underline" to={`/training/${role}/${module.id}`}>
              {module.title}
            </Link>
          </li>
        )) || <p>No training available for this role.</p>}
      </ul>
    </div>
  );
}
