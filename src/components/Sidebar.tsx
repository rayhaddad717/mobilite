import { useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  return (
    <div className="w-[300px] max-w-[30vw] h-[100vh] bg-white pt-4 border-r-[1px] border-gray-300">
      <h2 className="text-black text-center font-bold text-2xl mb-6">
        Mobilite
      </h2>
      <ul className="flex flex-col gap-2 px-2">
        {[
          { title: "Universities", url: "university" },
          { title: "Departments", url: "departments" },
          { title: "Master Programs,", url: "master-program" },
          { title: "Scholarships", url: "scholarships" },
          { title: "Candidates", url: "candidates" },
        ].map((nav, index) => (
          <li
            key={index}
            className={`px-2 py-2  font-normal cursor-pointer bg- rounded-md  duration-0 transition-all ease-in-out ${
              location.pathname.includes(nav.url)
                ? "text-white bg-[#242424]"
                : "hover:bg-gray-200"
            }`}
          >
            <a href={`/${nav.url}`} className="text-md w-full block">
              {nav.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
