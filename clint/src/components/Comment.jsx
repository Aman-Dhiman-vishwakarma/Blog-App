import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Textarea } from "flowbite-react";
import { HiThumbUp } from "react-icons/hi";
import { useSelector } from "react-redux";

const Comment = ({ comment, onClick, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((store) => store.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/user/getsingleuser/${comment?.userId}`);
      const data = await res.json();

      if (res.ok) {
        setUser(data);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment?.content)
  };

  const handleSave = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/comment/editcomment/${comment?._id}`, {
        method:"put",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({
          content: editedContent
        }),
      })
      const data = await res.json()
        if (res.ok) {
          setLoading(false)
          setIsEditing(false)
          onEdit(comment, editedContent)
        }
        if (!res.ok) {
          setLoading(false)
        }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="flex p-4 gap-2 border-b dark:border-gray-600">
      <div className="flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-bold text-sm mr-1 truncate">
            {user ? `@${user?.username}` : "anonymos user"}
          </span>
          <span className="text-gray-500 text-sm">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
          <Textarea
          className="mb-2"
            rows="2"
            value={editedContent}
            onChange={(e)=>{setEditedContent(e.target.value)}}
          />
          <div className=" flex justify-end gap-2">
            <Button gradientDuoTone="purpleToBlue" onClick={handleSave}> {loading ? "Loading..." : "Save"}</Button>
            <Button gradientDuoTone="purpleToBlue" outline onClick={()=>{setIsEditing(false)}}>Cancle</Button>
          </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm pb-2">{comment?.content}</p>
        )}

        <div className="flex items-center gap-2 border-t pt-1 w-fit">
          <button
            type="button"
            className={`text-gray-500 hover:text-blue-500  ${
              currentUser &&
              comment?.likes.includes(currentUser?._id) &&
              "!text-blue-600"
            }`}
            onClick={() => {
              onClick(comment?._id);
            }}
          >
            <HiThumbUp size="19px" />
          </button>
          <p className="text-gray-500 text-sm">
            {comment?.numbersOfLikes > 0 &&
              comment?.numbersOfLikes +
                " " +
                (comment?.numbersOfLikes === 1 ? "Like" : "Likes")}
          </p>
          {currentUser &&
            (comment.userId === currentUser?._id || currentUser?.isAdmin) && (
              <>
              <button
                type="button"
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-500"
              >
               Edit
              </button>
              <button
                type="button"
                onClick={()=>{onDelete(comment?._id)}}
                className="text-gray-400 hover:text-blue-500"
              >
                Deleted
              </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
