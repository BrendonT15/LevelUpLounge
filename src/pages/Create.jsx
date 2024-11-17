import Header from "../components/Header";
import { useState } from "react";
import "./Create.css";
import supabase from "../supabase";

const Create = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setError("Please fill out all fields");
            return;
        }

        // Generate a timestamp
        const timestamp = new Date().toISOString();

        try {
            const { data, error } = await supabase
                .from("hobbies")
                .insert([{ title, content, timestamp }]);

            if (error) {
                setError("Failed to create post");
                console.error(error);
            } else {
                setSuccess("Post created successfully!");
                setError(null);
                setTitle('');
                setContent('');
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };

    return (
        <div className="Create">
            <Header />
            <div className="create-container">
                <h1>Create a new Post</h1>

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
                                placeholder="Create a Title"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="content">Content:</label>
                            <input
                                type="text"
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Create a Content"
                            />
                        </div>
                    </div>

                    <button type="submit" className="create-button">
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;
