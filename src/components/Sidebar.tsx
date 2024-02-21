function Sidebar() {
  return (
    <div className="w-[300px] h-[100vh] bg-white pt-4 border-r-[1px] border-gray-300">
      <h2 className="text-black text-center font-bold text-2xl mb-6">
        Mobilite
      </h2>
      <ul className="flex flex-col gap-2 px-2">
        {[
          "Universities",
          "Departments",
          "Master Programs",
          "Scholarships",
          "Candidates",
        ].map((title, index) => (
          <li
            key={index}
            className={`px-2 py-2  font-normal cursor-pointer bg- rounded-md  duration-0 transition-all ease-in-out ${
              index === 0 ? "text-white bg-[#242424]" : "hover:bg-gray-200"
            }`}
          >
            <p className="text-md">{title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
