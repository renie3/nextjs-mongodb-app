"use client";

import Image from "next/image";
import AddCommentForm from "./forms/AddCommentForm";
import Link from "next/link";
import { Session } from "next-auth";
import Comment from "./Comment";
import { CommentType } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

const fetchComments = async ({
  pageParam,
  postId,
}: {
  pageParam: number;
  postId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?cursor=${pageParam}&postId=${postId}`
  );
  return res.json();
};

const Comments = ({
  postId,
  session,
}: {
  postId: string;
  session: Session | null;
}) => {
  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 0 }) => fetchComments({ pageParam, postId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // console.log(data);

  const allComments: CommentType[] =
    data?.pages?.flatMap((page) => page.comments) || [];

  return (
    <>
      <h1 className="text-2xl font-medium mb-5">Comments</h1>
      {session?.user ? (
        <div className="flex gap-2">
          <Image
            src={session.user?.image || "/noavatar.png"}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <AddCommentForm postId={postId} />
        </div>
      ) : (
        <div className="mb-2">
          <Link href="/login" className="underline">
            Login to write a comment
          </Link>
        </div>
      )}
      {status === "pending" ? (
        <div className="w-full flex justify-center">
          <div className="spinner" />
        </div>
      ) : status === "error" ? (
        "Something went wrong"
      ) : (
        <InfiniteScroll
          dataLength={allComments.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="w-full flex justify-center pt-20 pb-5">
              <div className="spinner" />
            </div>
          }
          style={{ overflow: "visible" }}
          // endMessage={
          //   <p>
          //     <b>All posts loaded!</b>
          //   </p>
          // }
        >
          <div className="flex flex-col gap-7 mt-7">
            {allComments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                postId={postId}
                userId={session?.user.id}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default Comments;
