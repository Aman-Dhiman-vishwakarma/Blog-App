import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique:true
  },
  image:{
    type:String,
    default:"https://inc42.com/wp-content/uploads/2014/04/write-a-great-blog-post.jpg"
  },
  category: {
    type: String,
    default:"uncategorized"
  },
  slug: {
    type: String,
    required: true,
    unique:true
  },
}, {timestamps:true});

export const Post = mongoose.model("Post", postSchema)