import { useNavigate } from "react-router-dom";

export default function Module1() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold">Server Training - Basics</h1>
      <p>Content for Server Module 1 will go here.</p>

      <div className="flex justify-between mt-6">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => navigate("/training/server/module2")}>
          Next
        </button>
      </div>
    </div>
  );
}
