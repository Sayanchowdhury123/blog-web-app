import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function RealTimeCollabSection() {
  const [activeUser, setActiveUser] = useState(0);
  const navigate = useNavigate()
  const videourl1 = "/assets/a.mp4"
  const videourl2 = "/assets/r.mp4"
  const users = [
    { name: "Rehan Roy", color: "#3B82F6", avatar: "R" },
    { name: "Ayan Choudhury", color: "#EC4899", avatar: "A" }
  ];

  // Simulate user switching every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUser(prev => (prev + 1) % users.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-cyan-50/30 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-spaceGrotesk mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Real-Time Collaboration, Reimagined
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            See how teams create together — no more version chaos or lost edits.
          </motion.p>
        </div>

        {/* Two Editor Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Panel - User 1 */}
          <motion.div
            className="border rounded-xl p-4 bg-white/80 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-8 h-8 rounded-full ${users[0].color} flex items-center justify-center text-white text-xs`}
                >
                  {users[0].avatar}
                </div>
                <span className="font-medium">{users[0].name}</span>
              </div>
              <div className="text-xs text-gray-500">Editing...</div>
            </div>
            
            <div className="border border-gray-200 p-4 min-h-[300px]">
              <video src={videourl1} autoPlay muted loop>


              </video>
            </div>
          </motion.div>

          {/* Right Panel - User 2 */}
          <motion.div
            className="border rounded-xl p-4 bg-white/80 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-8 h-8 rounded-full ${users[1].color} flex items-center justify-center text-white text-xs`}
                >
                  {users[1].avatar}
                </div>
                <span className="font-medium">{users[1].name}</span>
              </div>
              <div className="text-xs text-gray-500">Commenting...</div>
            </div>
            
            <div className="border border-gray-200 p-4 min-h-[300px]">
              <video src={videourl2} loop autoPlay muted></video>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Live Cursors", desc: "See collaborators' cursors and edits instantly with Yjs CRDT sync." },
            { title: "AI-Powered Drafts", desc: "Generate blog ideas with OpenRouter integration in one click." },
            { title: "Secure & Private", desc: "Invite-only collaboration with end-to-end control." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-4`}>
                <div className="w-6 h-6 rounded bg-white/20"></div>
              </div>
              <h3 className="font-bold text-xl mb-2 font-spaceGrotesk">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button className="btn btn-primary glass text-white py-3 px-8 rounded-xl font-spaceGrotesk font-bold" onClick={() => navigate(`/signup`)}>
            Start Collaborating →
          </button>
        </motion.div>
      </div>
    </section>
  );
}