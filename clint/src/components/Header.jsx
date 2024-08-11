import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toaggleTheme } from "../redux/themeSlice";
import { signOutSuccess } from "../redux/userSlice";
import { useEffect, useState } from "react";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((store) => store.user);
  const {theme} = useSelector((store)=>store.theme)
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const neviget = useNavigate();

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
      method:"POST"
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signOutSuccess())
        neviget("/sign-in")
      }
    } catch (error) {
      
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuary = urlParams.toString()
    neviget(`/search?${searchQuary}`)
  }
  
  return (
    <Navbar className="border-b-2 dark:border-0">
      <Link
        to="/"
        className=" self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500  via-indigo-600 to-blue-800 rounded-md text-white">
          Aman's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit} className="w-[35%] hidden lg:inline">
        <TextInput
          type="text"
          placeholder="Search...."
          rightIcon={AiOutlineSearch}
          className=" hidden lg:inline"
          value={searchTerm}
          onChange={(e)=>{setSearchTerm(e.target.value)}}
        />
      </form>
      <Link to="/search">
      <Button className="w-12 h-10 lg:hidden" color="gray">
        <AiOutlineSearch size="22px" />
      </Button>
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" onClick={()=>{dispatch(toaggleTheme())}}>
          {
            theme === "light" ? <FaMoon size="20px" /> : <IoSunnySharp size="20px" />
          }
        </Button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={
            <Avatar className="ml-4" alt="user" img={currentUser?.profilePicture} rounded />
          }>
           <Dropdown.Header>
            <span className="block text-sm font-medium ">UserName: {currentUser?.username}</span>
            <span className="block text-base font-semibold truncate mt-2">Email: {currentUser?.email}</span>
           </Dropdown.Header>
           <Link to={"/dashbord?tab=profile"}>
           <Dropdown.Item className=" text-base font-semibold">Profile</Dropdown.Item>
           </Link>
           <Dropdown.Divider />
           <Dropdown.Item className="font-semibold" onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
