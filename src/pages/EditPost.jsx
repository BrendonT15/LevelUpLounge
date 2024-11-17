import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Create.css"; // Reuse the same CSS
import supabase from "../supabase";

const EditPost = () => {
    const { id } = useParams(); // Get the post ID from the URL
    const navigate = useNavigate(); // For navigation after updating

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the existing post data to pre-fill the form
    useEffect(() => {
        const fetchPost = async () => {
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
                setContent(data.content);
                setError(null);
            }
            setLoading(false);
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setError("Please fill out all fields");
            return;
        }

        try {
            const { error } = await supabase
                .from("hobbies")
                .update({ title, content })
                .eq("id", id);

            if (error) {
                setError("Failed to update post");
                console.error(error);
            } else {
                setSuccess("Post updated successfully!");
                setError(null);

                // Navigate back to the post details page
                setTimeout(() => {
                    navigate(`/details/${id}`);
                }, 2000);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="Create">
                <Header />
                <div className="create-container">
                    <h1>Loading post...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="Create">
            <Header />
            <div className="create-container">
                <h1>Edit Post</h1>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-container">
                        <div className="input-group">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Update the Title"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="content">Content:</label>
                            <input
                                type="text"
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Update the Content"
                            />
                        </div>
                    </div>

                    <button type="submit" className="create-button">
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;