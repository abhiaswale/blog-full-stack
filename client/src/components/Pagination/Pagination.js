import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
const Pagination = (props) => {
  const pages = new Array(props.numberOfPages).fill(null);

  //PAGINATION LOGIC
  const pageHandler = (i) => {
    props.setPageNumber(i + 1);
    window.scrollTo(0, 0);
  };
  const goToPrevious = () => {
    props.setPageNumber(Math.max(1, props.currentPage - 1));
    window.scrollTo(0, 0);
  };
  const goToNext = () => {
    props.setPageNumber(Math.min(props.numberOfPages, props.currentPage + 1));
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <section className="flex justify-center items-center font-normal lg:text-lg text:sm my-4">
        <button
          className="bg-white p-1 border-2 border-black mx-2"
          onClick={goToPrevious}
        >
          <NavigateBeforeIcon />
        </button>
        {pages.map((val, index) => (
          <button
            className={`bg-white px-3 py-1 border-2 border-black mx-2 ${
              index + 1 === props.currentPage ? "bg-cyan-300" : ""
            }`}
            key={index}
            onClick={() => {
              pageHandler(index);
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="bg-white p-1 border-2 border-black mx-2"
          onClick={goToNext}
        >
          <NavigateNextIcon />
        </button>
      </section>
    </div>
  );
};

export default Pagination;
