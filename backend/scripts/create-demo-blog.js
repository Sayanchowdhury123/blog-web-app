const mongoose = require("mongoose");
const Blog = require("../models/Blogs"); // Adjust path to your Blog model



 exports.createDemoBlog = async () => {
  try {
    // Check if demo blog already exists
    const existingDemo = await Blog.findOne({ title: "Live Collaboration Demo" });
    if (existingDemo) {
    
      process.exit(0);
    }

    // Create demo blog
    const demoBlog = new Blog({
      title: "Live Collaboration Demo",
      blogtext: "<p>👉 <strong>Type here to test real-time editing!</strong> 👈</p><p>Simulated collaborators will join automatically...</p>",
      creator: new mongoose.Types.ObjectId(), // Fake ID (not a real user)
      collabrators: [], // Empty = public demo (anyone can join)
      isCollabActive: true, // Enable collaboration
      approval: true, // Skip approval for demo
      tags: ["demo", "collaboration"]
    });
    await demoBlog.save();
   
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create demo blog:", error);
    process.exit(1);
  }
}

