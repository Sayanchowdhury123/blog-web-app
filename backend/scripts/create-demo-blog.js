const mongoose = require("mongoose");
const Blog = require("../models/Blogs"); // Adjust path to your Blog model



 exports.createDemoBlog = async () => {
  try {
    // Check if demo blog already exists
    const existingDemo = await Blog.findOne({ title: "Live Collaboration Demo" });
    if (existingDemo) {
      console.log("✅ Demo blog already exists:", existingDemo._id);
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
    console.log("✅ Demo blog created successfully!");
    console.log("📝 Demo Blog ID:", demoBlog._id.toString());
    console.log("🔑 Add this to your .env file as DEMO_BLOG_ID");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create demo blog:", error);
    process.exit(1);
  }
}

