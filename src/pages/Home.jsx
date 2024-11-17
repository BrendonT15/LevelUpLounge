import { useState, useEffect } from 'react'
import supabase from "../supabase"

import "./Home.css"
import Header from "../components/Header"
import PostCard from "../components/PostCard"

const Home = () => {
    const [error, setError] = useState(null);
    const [postList, setPostList] = useState([]);
    const [sortMethod, setSortMethod] = useState("recent"); // Default sort method
    const [searchTerm, setSearchTerm] = useState(""); // State to track search input

    useEffect(() => {
        const fetchList = async () => {
            const { data, error } = await supabase.from("hobbies").select("*");

            if (data) {
                setPostList(data);
                setError(null);
            } else if (error) {
                setError("Could not fetch Post Lists.");
                setPostList([]);
                console.error(error);
            }
        };

        fetchList();
    }, []);

    // Filter posts based on the search term
    const filteredPosts = postList.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort posts based on the selected filter
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortMethod === "recent") {
            // Sort by timestamp (most recent first)
            return new Date(b.timestamp) - new Date(a.timestamp);
        } else if (sortMethod === "upvotes") {
            // Sort by upvotes (highest first)
            return b.upvotes - a.upvotes;
        }
        return 0; // Default fallback
    });

    return (
        <div className="Home">
            <Header />
            <div className="functionality">
                <div className="filter-container">
                    <h3>Order By: </h3>
                    <div className="filter-buttons">
                        <button
                            className={`filter recent ${sortMethod === "recent" ? "active" : ""}`}
                            onClick={() => setSortMethod("recent")}
                        >
                            Most Recent
                        </button>
                        <button
                            className={`filter likes ${sortMethod === "upvotes" ? "active" : ""}`}
                            onClick={() => setSortMethod("upvotes")}
                        >
                            Most Upvotes
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a Post"
                        value={searchTerm} // Bind the input to searchTerm state
                        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                    />
                </div>
            </div>
            {error && <p>{error}</p>}
            <div className="post-card-list">
                {sortedPosts.length > 0 ? (
                    sortedPosts.map((post) => (
                        <PostCard
                            key={post.id} // Add a unique key
                            id={post.id} // Pass the ID as a prop
                            title={post.title}
                            timestamp={post.timestamp}
                            upvotes={post.upvotes}
                        />
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
        </div>
    );
};

export default Home;