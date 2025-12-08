import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import blogAnimation from "../assets/blog-collab.json"
import btAnimation from "../assets/bt.json";

// Register GSAP plugins ONCE (outside component)
gsap.registerPlugin(ScrollTrigger);

export default function Intropage() {
    const [isMounted, setIsMounted] = useState(false);


    const heroRef = useRef(null);
    const blob1Ref = useRef(null);
    const blob2Ref = useRef(null);



    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 200);
        return () => clearTimeout(timer);
    }, []);


    // Add this near your other refs
    const parallaxRefs = useRef({
        bg: null,
        mid: null,
        fg: null
    });

    const iconRefs = useRef({
        a: null,
        s: null,
        t: null
    });


    useEffect(() => {
        gsap.from(heroRef.current, {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out"
        });

        // Floating blobs
        const blob1Tween = gsap.to(blob1Ref.current, {
            y: -20,
            yoyo: true,
            repeat: -1,
            duration: 4,
            ease: "sine.inOut"
        });
        const blob2Tween = gsap.to(blob2Ref.current, {
            y: 20,
            yoyo: true,
            repeat: -1,
            duration: 5,
            ease: "sine.inOut"
        });

        // Feature cards scroll animation
        const featureCards = gsap.utils.toArray('.feature-card');
        featureCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
                duration: 0.6,
                delay: i * 0.15,
                ease: "power2.out"
            });
        });

        if (parallaxRefs.current.bg && parallaxRefs.current.mid && parallaxRefs.current.fg) {
            const parallaxTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".parallax", // The parallax section
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Background: slowest movement
            parallaxTl.to(parallaxRefs.current.bg, {
                y: -30,
                scale: 1.1,
                ease: "none"
            }, 0);

            // Midground: medium speed
            parallaxTl.to(parallaxRefs.current.mid, {
                y: -60,
                x: 40,
                scale: 1.15,
                ease: "none"
            }, 0);

            // Foreground: fastest movement (laptop)
            parallaxTl.to(parallaxRefs.current.fg, {
                y: -100,
                scale: 1.05,
                ease: "none"
            }, 0);
        }


        if (iconRefs.current.a && iconRefs.current.s && iconRefs.current.t) {
            gsap.to(iconRefs.current.a, {
                y: -40,
                yoyo: true,
                repeat: -1,
                duration: 1,
                ease: "sine.inOut"
            });
            gsap.to(iconRefs.current.s, {
                y: 60,
                yoyo: true,
                repeat: -1,
                duration: 2,
                ease: "sine.inOut"
            });
            gsap.to(iconRefs.current.t, {
                x: -50,
                yoyo: true,
                repeat: -1,
                duration: 3,
                ease: "sine.inOut"
            });
        }


        // Cleanup
        return () => {
            blob1Tween.kill();
            blob2Tween.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);




    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-sans overflow-x-hidden main-bg">
            {/* Animated Blobs (Background) */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <svg
                    ref={blob1Ref}
                    className="absolute -top-40 -left-40 w-[400px] md:w-[600px] opacity-20"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M184.5 352C270.9 352 341 281.9 341 195.5C341 109.1 270.9 39 184.5 39C98.1 39 28 109.1 28 195.5C28 281.9 98.1 352 184.5 352Z"
                        fill="url(#paint0_radial_1_2)"
                    />
                    <defs>
                        <radialGradient id="paint0_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(184.5 195.5) rotate(90) scale(156.5)">
                            <stop stopColor="#8B5CF6" />
                            <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>

                <svg
                    ref={blob2Ref}
                    className="absolute -bottom-40 -right-40 w-[350px] md:w-[500px] opacity-15"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M200 360C288.366 360 360 288.366 360 200C360 111.634 288.366 40 200 40C111.634 40 40 111.634 40 200C40 288.366 111.634 360 200 360Z"
                        fill="url(#paint1_radial_1_3)"
                    />
                    <defs>
                        <radialGradient id="paint1_radial_1_3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(160)">
                            <stop stopColor="#EC4899" />
                            <stop offset="1" stopColor="#F43F5E" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Hero Section */}
            <div ref={heroRef} className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-spaceGrotesk mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Write Together, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">In Real Time</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto font-inter"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        A collaborative blog platform where teams edit, comment, and publish — all in one place. No more version chaos.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <button className="btn btn-primary btn-lg glass text-white">
                            Start Collaborating
                        </button>
                        <button className="btn btn-outline btn-lg text-gray-700">
                            View Demo
                        </button>
                    </motion.div>
                </div>

                {/* 3D Tilted Lottie Card */}
                <div className="mx-auto w-full max-w-4xl">
                    <Tilt
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        scale={1.02}
                        transitionSpeed={400}
                        glareColor="rgba(255, 255, 255, 0.3)"
                        glareEnable={true}
                        glareMaxOpacity={0.4}
                        glarePosition="bottom"
                        glareBorderRadius="24px"
                        className="rounded-3xl"
                    >
                        <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-1 shadow-xl overflow-hidden">
                            <Lottie
                                animationData={blogAnimation}
                                loop={true}
                                className="w-full h-auto"
                            />
                        </div>
                    </Tilt>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 pb-20">
                <motion.h2
                    className="text-3xl font-bold text-center font-spaceGrotesk mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Why Teams Love It
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Real-Time Co-Editing",
                            desc: "See collaborators' cursors and edits instantly with Yjs CRDT sync.",
                            color: "from-blue-500 to-indigo-500"
                        },
                        {
                            title: "AI-Powered Drafts",
                            desc: "Generate blog ideas with OpenRouter integration in one click.",
                            color: "from-purple-500 to-pink-500"
                        },
                        {
                            title: "Secure & Private",
                            desc: "Invite-only collaboration with end-to-end control.",
                            color: "from-cyan-500 to-teal-500"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="feature-card bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                            // initial={{ opacity: 0, y: 30 }}
                            // animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            // transition={{ delay: i * 0.1, duration: 0.3, ease: "easeOut" }}
                            whileHover={{ y: -10 }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                                <div className="w-6 h-6 rounded bg-white/20"></div>
                            </div>
                            <h3 className="font-bold text-xl mb-2 font-spaceGrotesk">{feature.title}</h3>
                            <p className="text-gray-600 font-inter">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>


            {/* Parallax Showcase Section */}
            <div className="relative py-32 overflow-hidden parallax">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 to-cyan-50/30 -z-10"></div>

                {/* Parallax Layers */}
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-20">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold font-spaceGrotesk mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Experience Real-Time Collaboration
                        </motion.h2>
                        <p className="text-gray-600 max-w-2xl mx-auto font-inter">
                            Watch how teams create together — no more merging conflicts or lost edits.
                        </p>
                    </div>

                    {/* Parallax Container */}
                    <div className="relative max-w-5xl mx-auto h-[500px] md:h-[600px]">
                        {/* Background Layer (Clouds/Abstract) - Slowest */}
                        <div
                            ref={(el) => { if (el) parallaxRefs.current.bg = el; }}
                            className="absolute inset-0 opacity-30"
                        >
                            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/50 to-transparent rounded-full blur-3xl"></div>
                        </div>

                        {/* Midground Layer (Blob shapes) - Medium speed */}
                        <div
                            ref={(el) => { if (el) parallaxRefs.current.mid = el; }}
                            className="absolute top-20 left-10 w-64 h-64 md:w-80 md:h-80"
                        >
                            <div className="w-full h-full bg-gradient-to-r from-purple-300/40 to-pink-300/40 rounded-full blur-xl"></div>
                        </div>

                       

                        {/* Foreground: Laptop Mockup (Fastest) */}
                        <div
                            ref={(el) => { if (el) parallaxRefs.current.fg = el; }}
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[300px] md:w-[500px] parallax-laptop"
                        >
                            <Tilt
                                tiltMaxAngleX={5}
                                tiltMaxAngleY={5}
                                scale={1.01}
                                transitionSpeed={1000}
                                className="rounded-2xl overflow-hidden border border-white/30 shadow-2xl"
                            >
                                <div className="bg-white/80 backdrop-blur-sm p-4">
                                    <Lottie
                                        animationData={btAnimation}
                                        loop={true}
                                        className="w-full h-auto max-h-64"
                                    />
                                </div>
                            </Tilt>
                        </div>

                         <div ref={(el) => { if (el) iconRefs.current.a = el; }} className="absolute top-[0px] left-1/4 w-14 h-14">
                            <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
                        </div>

                        <div ref={(el) => { if (el) iconRefs.current.s = el; }} className="absolute top-[20px] right-1/4 w-14 h-14">
                            <div className="w-full h-full bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-xl">S</div>
                        </div>

                        <div ref={(el) => { if (el) iconRefs.current.t = el; }} className="absolute top-[110px] left-1/2 w-14 h-14">
                            <div className="w-full h-full bg-red-400 rounded-full flex items-center justify-center text-white font-bold text-xl">T</div>
                        </div>





                    </div>
                </div>
            </div>

           
        </div>
    );

}

