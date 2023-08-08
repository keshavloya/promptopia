"use client";
import PromptCard from "./PromptCard";
import { useEffect, useState } from "react";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const filterSearchPost = (search) => {
    console.log(posts);
    const regex = new RegExp(search, "i");
    const searchedPosts = posts.filter((post) => {
      return (
        post.creator.email.includes(search) ||
        post.creator.username.includes(search) ||
        post.prompt.includes(search) ||
        post.tag.includes(search)
      );
    });

    setFilteredPosts(searchedPosts);
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        filterSearchPost(e.target.value);
      }, 500)
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={filteredPosts}
        handleTagClick={(tag) => {
          setSearchText(tag);
          filterSearchPost(tag);
        }}
      />
    </section>
  );
};

export default Feed;
