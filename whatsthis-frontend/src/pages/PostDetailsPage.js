"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import postService from "../../../services/postService";

export default function PostDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // Grab post ID from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      postService.getPostById(id)
        .then((data) => {
          setPost(data);
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
        });
    }
  }, [id]);

  if (!post) {
    return (
      <div className="text-teal-300 text-xl text-center">Loading post details...</div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold mb-4">{post.title}</h2>
          <p className="text-sm text-gray-400 mb-4">Posted by User ID: {post.userId}</p>
          <p className="text-lg text-gray-300 mb-6">{post.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {<DescriptionItem label="Material" value={post.material || "Not specified"} />}
            {<DescriptionItem label="Size" value={post.size || "Not specified"} />}
            {<DescriptionItem label="Text and Language" value={post.textAndLanguage || "Not specified"} />}
            {<DescriptionItem label="Color" value={post.color || "Not specified"} />}
            {<DescriptionItem label="Shape" value={post.shape || "Not specified"} />}
            {<DescriptionItem label="Weight" value={post.weight || "Not specified"} />}
            {<DescriptionItem label="Description of Parts" value={post.descriptionOfParts || "Not specified"} />}
            {<DescriptionItem label="Location" value={post.location || "Not specified"} />}
            {<DescriptionItem label="Time Period" value={post.timePeriod || "Not specified"} />}
            {<DescriptionItem label="Smell" value={post.smell || "Not specified"} />}
            {<DescriptionItem label="Taste" value={post.taste || "Not specified"} />}
            {<DescriptionItem label="Texture" value={post.texture || "Not specified"} />}
            {<DescriptionItem label="Hardness" value={post.hardness || "Not specified"} />}
            {<DescriptionItem label="Pattern" value={post.pattern || "Not specified"} />}
            {<DescriptionItem label="Brand" value={post.brand || "Not specified"} />}
            {<DescriptionItem label="Print" value={post.print || "Not specified"} />}
            {<DescriptionItem label="Icons" value={post.icons || "Not specified"} />}
            {<DescriptionItem label="Handmade" value={post.handmade !== null ? (post.handmade ? "Yes" : "No") : "Not specified"} />}
            {<DescriptionItem label="Functionality" value={post.functionality || "Not specified"} />}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-teal-300 text-xl mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-teal-700 text-teal-200 px-3 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {post.imageUrls && post.imageUrls.length > 0 && (
            <div className="mt-6">
              <h4 className="text-teal-300 text-xl mb-2">Images:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post Image ${index + 1}`}
                    className="w-full h-auto rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          {post.comments && post.comments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-teal-300 text-xl mb-2">Comments:</h4>
              <div className="flex flex-col gap-4">
                {post.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-md">
                    <p className="text-gray-300">{comment.text}</p>
                    <p className="text-sm text-gray-500">Votes: {comment.votes}</p>
                    <p className="text-sm text-gray-500">Posted by User ID: {comment.userId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable component for displaying descriptions
const DescriptionItem = ({ label, value }) => (
  <div className="bg-gray-700 p-4 rounded-lg mb-4">
    <p className="text-teal-300 font-bold">{label}:</p>
    <p className="text-gray-300">{value}</p>
  </div>
);
