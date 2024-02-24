import API from "@/api/API";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  if (localStorage.getItem("isLoggedIn") !== "true") return null;
  const logout = async () => {
    localStorage.clear();
    navigate("/login");
    await API.get("/logout");
  };
  return (
    <div className="w-[300px] max-w-[30vw] h-[100vh] bg-white pt-4 border-r-[1px] border-gray-300">
      <h2 className="text-black text-center font-bold text-2xl mb-6">
        Mobilite
      </h2>
      <ul className="flex flex-col gap-2 px-2">
        {[
          { title: "Universities", url: "university" },
          { title: "Scholarship", url: "scholarship" },
          { title: "Master", url: "masters" },
          { title: "Students", url: "students" },
          { title: "Student Inscriptions", url: "student_inscription" },
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
        <li
          className="px-2 py-2  font-normal cursor-pointer bg- rounded-md  duration-0 transition-all ease-in-out hover:bg-gray-200"
          onClick={logout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
