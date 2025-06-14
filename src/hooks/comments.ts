import { useEffect, useState } from "react";

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  //Fetch
  useEffect(() => {
    //Cek apakah array data comment kosong atau tidak
    if (comments.length === 0) {
      try {
        //Ambil data di localstorage
        const data = localStorage.getItem("comments") || "";
        //Jika ada di localstorage setComments dari localstorage
        if (data !== "") {
          setComments(JSON.parse(localStorage.getItem("comments")!));
          //Jika tidak ada di localstorage fetch API
        } else {
          fetch(`${API_BASE}`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch((err) => console.error("Fetch comments failed", err));
        }
      } catch (e) {
        console.log(`Error`, e);
      }
    }
  }, []);

  useEffect(() => {
    if (comments.length === 0) return;
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  //Get all data comments
  const getComments = () => {
    return comments;
  };
  //Search comments
  const searchComments = (input: string) => {
    return comments.filter(
      (item) =>
        item.id.toString() === input ||
        item.postId.toString() === input ||
        item.name.includes(input) ||
        item.email.includes(input) ||
        item.body.includes(input),
    );
  };

  //Create Id for data new comment
  const createId = () => {
    const data = [...comments];
    data.sort((a, b) => b.id - a.id);
    return data[0].id + 1;
  };

  //Create postId for data new comment
  const createPostId = () => {
    let randomNumber = Math.random();
    return randomNumber;
  };

  //Add comment
  const addComment = (comment: Comment) => {
    setComments([
      ...comments,
      {
        id: createId(),
        postId: createPostId(),
        name: comment.name,
        email: comment.email,
        body: comment.body,
      },
    ]);
  };

  //Delete comment
  const deleteComment = (id: number) => {
    setComments(comments.filter((item) => item.id !== id));
  };

  return {
    comments,
    getComments,
    searchComments,
    addComment,
    deleteComment,
  };
}
