"use client";

import { useRef } from "react";
import type { Post } from "@/data/posts";
import PostCard from "./PostCard";

export default function PostsCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  function scrollByAmount(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!trackRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = trackRef.current.scrollLeft;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !trackRef.current) return;
    const delta = e.clientX - dragStartX.current;
    trackRef.current.scrollLeft = scrollStartX.current - delta;
  }

  function stopDragging() {
    isDragging.current = false;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByAmount(-320)}
        aria-label="Anterior"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10
                   items-center justify-center rounded-full bg-black/60 border border-fuchsia-500/40
                   hover:bg-fuchsia-600 transition-colors"
      >
        ‹
      </button>

      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 cursor-grab active:cursor-grabbing
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(320)}
        aria-label="Próximo"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10
                   items-center justify-center rounded-full bg-black/60 border border-fuchsia-500/40
                   hover:bg-fuchsia-600 transition-colors"
      >
        ›
      </button>
    </div>
  );
}
