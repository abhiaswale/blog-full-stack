import React from "react";
import {
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillLinkedin,
} from "react-icons/ai";

const Footer = () => {
  return (
    <div>
      <div className="py-4">
        <div className="w-full border-t border-blue-200"></div>
      </div>
      <div className="flex justify-center items-center flex-row my-6">
        <div className="text-neutral-500 hover:text-cyan-500 text-3xl mx-4 transition-all ease-in-out delay-150">
          <a
            href="https://github.com/abhiaswale"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillGithub />
          </a>
        </div>
        <div className="text-neutral-500 hover:text-cyan-500 text-3xl mx-4 transition-all ease-in-out delay-150">
          <a
            href="https://twitter.com/_abhi42"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillTwitterCircle />
          </a>
        </div>
        <div className="text-neutral-500 hover:text-cyan-500 text-3xl mx-4 transition-all ease-in-out delay-150">
          <a
            href="https://www.linkedin.com/in/abhishek-aswale-110b931b3/"
            target="_blank"
            rel="noreferrer"
          >
            <AiFillLinkedin />
          </a>
        </div>
      </div>
      <div className="font-medium text-center mb-2">
        <p>
          <span>©2022</span>, Built with
          <span className="text-cyan-500">&nbsp; React Js</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
