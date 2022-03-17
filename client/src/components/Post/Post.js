import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const Post = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const editPostHandler = (id) => {
    navigate("/postform", { state: id, editing: true });
  };

  return (
    <div className="border-2 border-sky-500 w-full my-3">
      <li key={props._id} className="list-none p-2">
        <p className="text-xs lg:my-2">
          Created by{" "}
          {props.creator === authCtx.userId ? (
            <span>you</span>
          ) : (
            <span>{props.creatorName}</span>
          )}{" "}
          at {props.createdAt.split("T")[0]}
        </p>
        <h5 className="font-bold lg:text-xl text-base my-2">{props.title}</h5>
        <div className="flex justify-end items-center">
          <button
            className="lg:text-base text-sm p-2 hover:bg-neutral-400 font-semibold transition ease-in-out "
            onClick={() => {
              console.log(props._id.toString());
              navigate(`/post/${props._id}`);
            }}
          >
            VIEW
          </button>
          {props.creator === authCtx.userId && (
            <span>
              <button
                className="lg:text-base text-sm p-2 hover:bg-neutral-400 font-semibold"
                onClick={() => {
                  editPostHandler(props._id);
                }}
              >
                EDIT
              </button>
              <button
                className="lg:text-base text-sm p-2 hover:bg-neutral-400 font-semibold text-red-700"
                onClick={() => {
                  props.onDelete(props._id);
                }}
              >
                DELETE
              </button>
            </span>
          )}
        </div>
      </li>
    </div>
  );
};

export default Post;
