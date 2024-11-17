import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase"
import "./PostCard.css"

const PostCard = ({ id, title, timestamp, upvotes }) => {
    // Function to calculate relative time
    const getRelativeTime = (timestamp) => {
        const postDate = new Date(timestamp); // Supabase timestamp
        const currentDate = new Date(); // Current time
        const diffInMs = currentDate - postDate; // Difference in milliseconds

        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Convert to hours
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes

        if (diffInDays > 0) {
            return `Posted ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        } else if (diffInHours > 0) {
            return `Posted ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        } else {
            return `Posted ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        }
    };

    return (
        <div className="PostCard">
            <Link to={`/details/${id}`} className="PostCard-Details">
                <h2>{title}</h2>
                <h2>{getRelativeTime(timestamp)}</h2>
                <h2>{upvotes} Upvotes</h2>
            </Link>
        </div>
    );
};

export default PostCard;