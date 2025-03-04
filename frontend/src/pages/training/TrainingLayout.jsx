import { Outlet, useParams } from "react-router-dom";
import TableOfContents from "./TableOfContents";

export default function TrainingLayout() {
  const { role } = useParams();

  return (
    <div className="flex">
      <TableOfContents role={role} />
      <div className="p-6 flex-1">
        <Outlet /> {/* This will render the selected training module */}
      </div>
    </div>
  );
}