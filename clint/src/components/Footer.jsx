import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsTwitterX, BsInstagram, BsGithub, BsDribbble } from "react-icons/bs";

const Footercomp = () => {
  return (
    <>
      <Footer container className="border border-t-2 dark:border-0">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full grid justify-between sm:flex md:grid-cols-1">
            <div className="mt-5">
              <Link
                to="/"
                className=" self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500  via-indigo-600 to-blue-800 rounded-md text-white">
                  Aman's
                </span>
                Blog
              </Link>
            </div>
            <div className="sm:w-[50%] grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-10">
               <div>
                <Footer.Title title="About" />
                <Footer.LinkGroup col> 
                <Footer.Link href="#">
                    Projects
                  </Footer.Link>
                  <Footer.Link href="#">
                    Mern Projects
                  </Footer.Link>
                </Footer.LinkGroup>
               </div>
               <div>
                <Footer.Title title="Follow Us" />
                <Footer.LinkGroup col> 
                <Footer.Link href="https://github.com/Aman-Dhiman-vishwakarma" target='_blank' rel='noopener noreferrer'>
                    Git Hub
                  </Footer.Link>
                  <Footer.Link href="#">
                   Linkdin
                  </Footer.Link>
                </Footer.LinkGroup>
               </div>
               <div>
                <Footer.Title title="Leagel" />
                <Footer.LinkGroup col> 
                <Footer.Link href="#">
                    Privacy Policy
                  </Footer.Link>
                  <Footer.Link href="#">
                    Trems & Condition
                  </Footer.Link>
                </Footer.LinkGroup>
               </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex items-center sm:justify-between">
            <Footer.Copyright href="#" by="Aman's Blog" year={new Date().getFullYear()} />
            <div className="flex gap-5 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsTwitterX} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="https://github.com/Aman-Dhiman-vishwakarma" target='_blank' rel='noopener noreferrer' icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
          </div>
        </div>
      </Footer>
    </>
  );
};

export default Footercomp;
