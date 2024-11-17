import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import supabase from "../supabase";
import "./Details.css";

const Details = () => {
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [content, setContent] = useState("");
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch post and comments data when the component mounts
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("hobbies")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
                setError("Failed to fetch post data.");
            } else if (data) {
                setTitle(data.title);
                setTimestamp(data.timestamp);
                setContent(data.content);
                setLikes(data.upvotes || 0);
                setError(null);
            }

            const { data: commentsData, error: commentsError } = await supabase
                .from("comments")
                .select("*")
                .eq("post_id", id)
                .order("timestamp", { ascending: true });

            if (commentsError) {
                console.error("Error fetching comments:", commentsError);
            } else {
                setComments(commentsData || []);
            }

            setLoading(false);
        };

        fetchPost();
    }, [id]);

    const handleUpvote = async () => {
        try {
            const newLikes = likes + 1;
            setLikes(newLikes);

            const { error } = await supabase
                .from("hobbies")
                .update({ upvotes: newLikes })
                .eq("id", id);

            if (error) {
                console.error("Error updating upvotes:", error);
                setLikes(likes);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setLikes(likes);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const { error } = await supabase
            .from("comments")
            .insert([
                {
                    post_id: id,
                    content: newComment,
                    timestamp: new Date().toISOString(),
                },
            ]);

        if (error) {
            console.error("Error adding comment:", error);
        } else {
            setNewComment(""); // Clear input
            // Refetch all comments
            const { data: updatedComments, error: fetchError } = await supabase
                .from("comments")
                .select("*")
                .eq("post_id", id)
                .order("timestamp", { ascending: true });

            if (fetchError) {
                console.error("Error fetching updated comments:", fetchError);
            } else {
                setComments(updatedComments || []);
            }
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post and all associated comments?");
        if (!confirmDelete) return;
    
        try {
            // Step 1: Delete comments associated with the post
            const { error: commentsError } = await supabase
                .from("comments")
                .delete()
                .eq("post_id", id);
    
            if (commentsError) {
                console.error("Error deleting comments:", commentsError);
                alert("Failed to delete comments. Please try again.");
                return;
            }
    
            // Step 2: Delete the post
            const { error: postError } = await supabase
                .from("hobbies")
                .delete()
                .eq("id", id);
    
            if (postError) {
                console.error("Error deleting post:", postError);
                alert("Failed to delete the post. Please try again.");
            } else {
                // Navigate back to the homepage after successful deletion
                alert("Post and associated comments deleted successfully!");
                navigate("/");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handleEdit = () => {
        navigate(`/edit/${id}`); // Navigate to the edit page
    };

    if (loading) {
        return (
            <div className="Details">
                <Header />
                <p>Loading post...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Details">
                <Header />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="Details">
            <Header />
            <div className="details-card">
                <h2>Posted {new Date(timestamp).toLocaleString()}</h2>
                <h1>{title}</h1>
                <p>{content}</p>
                <button onClick={handleUpvote}>Upvote ({likes})</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleEdit}>Edit</button>
            </div>
            <div className="comments-container">
                <h3>Comments:</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.content}</p>
                            <span>{new Date(comment.timestamp).toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
                <div className="add-comment">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    />
                    <button onClick={handleAddComment}>Post Comment</button>
                </div>
            </div>
        </div>
    );
};

export default Details;