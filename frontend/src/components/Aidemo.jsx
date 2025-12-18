import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Aidemo() {
    const [userTopic, setUserTopic] = useState('cybersecurity');
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const videoUrl ='/assets/aidemo.mp4';
    const navigate = useNavigate();


    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = videoRef.current;
                if (!video) return;

                if (entry.isIntersecting) {
            
                    video.play().catch(e => console.log("Autoplay prevented:", e));
                } else {
                    
                    video.pause();
                }
            });
        }, {
            threshold: 0.1 
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);


    const handleTopicChange = (e) => {
        const newTopic = e.target.value;
        setUserTopic(newTopic || 'blog topic');


    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    return (
        <section
            ref={containerRef}
            className="py-24 relative overflow-hidden"
        >
     
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
                        AI That Writes About <span className="text-cyan-600">Anything</span>
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Type any topic below → Watch our AI generate a professional blog in real-time
                    </motion.p>
                </div>

                
                <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 md:p-8 shadow-xl">
            
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            <label className="font-spaceGrotesk font-bold text-gray-800">
                                Enter any topic:
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={userTopic}
                                onChange={handleTopicChange}
                                placeholder="e.g., sustainable fashion, quantum computing, healthy meal prep..."
                                className="w-full px-5 py-4 text-lg rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                ↵
                            </div>
                        </div>
                    </div>

                    <div className="glass relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900">
                   
                        <div className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 text-sm">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-4 font-mono">ai-blog-generator --topic "{userTopic}"</div>
                        </div>

                        <div className="relative pt-[56.25%]">
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                muted
                                loop
                                playsInline
                                onPlay={handlePlay}
                                onPause={handlePause}
                             
                                preload="metadata"
                            />

                            {/* Fake terminal text overlay */}
                            <div className="absolute inset-0 flex items-center justify-center text-green-400 font-mono text-sm md:text-base px-4">
                                <div className="text-center max-w-2xl">

                                </div>
                            </div>
                        </div>
                    </div>

                
                    <motion.div
                        className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Your AI-Generated Blog Will Include:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                Professional structure (H1/H2 headings)
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                SEO-optimized content
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                Ready to collaborate with your team
                            </li>
                        </ul>
                    </motion.div>

            
                    <motion.button
                        className="w-full mt-8 btn btn-primary glass text-white py-4 rounded-xl font-spaceGrotesk font-bold text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          
                            navigate(`/signup`)
                        }}
                    >
                        Generate My Blog Now →
                    </motion.button>
                </div>

     
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-amber-50/60 px-4 py-2 rounded-full border border-amber-200">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-amber-700 font-medium">No credit card needed • 100% original content</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}