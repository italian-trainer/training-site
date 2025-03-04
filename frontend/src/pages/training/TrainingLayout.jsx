import { Outlet, useParams } from "react-router-dom";
import TableOfContents from "./TableOfContents";

export default function TrainingLayout() {
  const { role } = useParams(); // useParams() extracts "role" from url 
  //e.g: /training/server → role = "server"

  return (
    <div className="flex"> 
      <TableOfContents role={role} />  {/* renders table of contents, passes down "role"*/}
      <div className="p-6 flex-1">
        <Outlet /> {/* renders selected training module */}
      </div>
    </div>
  );
}