import { Link } from "react-router-dom";

const trainingModules = { //returns an array of "role" training modules
  server: [
    { id: "module1", title: "Server Training 1" },
    { id: "module2", title: "Server Training 2" },
  ],
  cashier: [
    { id: "module1", title: "Cashier Training 1" },
    { id: "module2", title: "Cashier Training 2" },
  ],
};

export default function TableOfContents({ role }) { //recieves "role" as a prop
  return (
    <div className="w-1/4 p-4 border-r">
      <h2 className="text-xl font-semibold mb-4">Training Modules</h2>
      <ul>
        {trainingModules[role]?.map(module => ( //array of modules dynamically accessed based on the "role"
        //?. if role does not exist, dont crash
        // .map goes loops through array conerting each module listed into an <li> element
          <li key={module.id} className="mb-2"> 
            <Link className="text-blue-500 hover:underline" to={`/training/${role}/${module.id}`}> 
            {/* e.g. role == server, module.id == module1, title == title1
            <Link ... to = {`/training/server/module1`}>
                title1
            </Link>
            creating a link displaying title1 taking us to /server/module1
            dynamically used for all modules on trainingModules array */}
              {module.title}
            </Link>
          </li>
        )) || <p>No training available for this role.</p>} 
      </ul>
    </div>
  );
}
