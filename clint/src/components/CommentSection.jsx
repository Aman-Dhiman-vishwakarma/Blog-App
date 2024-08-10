import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { PiWarningCircle } from "react-icons/pi";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((store) => store.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null)
  const naviget = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      setCommentError("You can't write more then 200 charectars");
      return;
    }
    if (comment === "") {
      setCommentError("Write somthing in the field to comment");
      return;
    }
    try {
      setLoading(true);
      setCommentError(null);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser?._id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setComment("");
        setLoading(false);
        setComments([data, ...comments]);
        setCommentError(null);
      }
      if (!res.ok) {
        setLoading(false);
      }
    } catch (error) {
      setCommentError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        naviget("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numbersOfLikes: data.numbersOfLikes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handitEdit = (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment?._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handelDelete = async (commentId) => {
    try {
      if (!currentUser) {
        naviget("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deletcomment/${commentToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((coment)=>coment._id !== commentToDelete))
        setShowModel(false)
        setCommentToDelete(null)
      }
      if (!res.ok) {
        setShowModel(false)
        setCommentToDelete(null)
      }
    } catch (error) {
      console.log(error);
      setShowModel(false)
        setCommentToDelete(null)
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-4">
      {currentUser ? (
        <div className="flex items-center gap-1 text-gray-500 text-sm my-2">
          <p className="font-semibold mr-1">Signed in as:</p>
          <img
            src={currentUser?.profilePicture}
            alt="user image"
            className="h-6 w-6 object-fill rounded-full"
          />
          <Link
            to="/dashbord?tab=profile"
            className="text-blue-600 hover:underline"
          >
            {currentUser?.username}
          </Link>
        </div>
      ) : (
        <div>
          {" "}
          You must be sugned in to comment?{" "}
          <Link className="text-blue-600 hover:underline" to="/sign-in">
            SignIn
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-4"
        >
          <Textarea
            type="text"
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500 text-xs">
              {200 - comment?.length} characters remaining
            </p>
            <Button
              type="submit"
              outline
              gradientDuoTone="purpleToBlue"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p>No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p className="font-bold mr-1">Comments:</p>
            <div className="border border-gray-400 py-[1px] px-2 rounded-sm">
              <p>{comments?.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment?._id}
              comment={comment}
              onClick={handleLike}
              onEdit={handitEdit}
              onDelete={(commentId) => {
                setShowModel(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal show={showModel} onClose={()=>{setShowModel(false)}} popup size="md" >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
            <PiWarningCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-600 mb-5 dark:text-gray-400">Are you sure you want to delete this comment?</h2>
            <div className="flex justify-between">
              <Button color="failure" onClick={handelDelete} >
                Yes I'm Sure
              </Button>
              <Button color="gray" onClick={()=>{setShowModel(false)}} >
                No, Cancle
              </Button>
            </div>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  );
};

export default CommentSection;
