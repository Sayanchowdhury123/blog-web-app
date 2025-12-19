import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import blogAnimation from "../assets/blog-collab.json"
import btAnimation from "../assets/bt.json";
import aiAnimation from "../assets/ai.json";
import AIBrain3D from '@/components/Aibrain3d';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from "react-icons/fi";
import AIdemo from '@/components/Aidemo';
import RealTimeCollabSection from '@/components/Realtimrcollab';



// Register GSAP plugins ONCE (outside component)
gsap.registerPlugin(ScrollTrigger);

export default function Intropage() {
    const [scorlled, setscorlled] = useState(false);
    const [Mounted, setIsMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate()

    const bloganimation ="../../public/assets/blog-collab.json";

    useEffect(() => {
        const handlescoll = () => {
            setscorlled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handlescoll)
        return () => window.removeEventListener("scroll", handlescoll)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);

            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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


    const statsRefs = useRef({
        time: null,
        conflicts: null,
        speed: null
    });

    const sectionRef = useRef(null);


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




    useLayoutEffect(() => {
        if (!sectionRef.current) return;

        // Wait for next tick to ensure DOM is ready
        const timer = setTimeout(() => {
            // Verify all refs are attached
            const allReady =
                statsRefs.current.time &&
                statsRefs.current.conflicts &&
                statsRefs.current.speed;

            if (!allReady) {
                console.warn("Stats refs not ready");
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Reset to 0 before animating
                        statsRefs.current.time.textContent = '0%';
                        statsRefs.current.conflicts.textContent = '0x';
                        statsRefs.current.speed.textContent = '0s';

                        // Animate Time (70%)
                        gsap.to({}, {
                            duration: 2,
                            ease: "power2.out",
                            onUpdate: function () {
                                const value = Math.round(this.progress() * 70);
                                statsRefs.current.time.textContent = `${value}%`;
                            },
                            onComplete: () => {
                                statsRefs.current.time.textContent = '70%';
                            }
                        });

                        gsap.to({}, {
                            duration: 1.8,
                            delay: 0.2,
                            ease: "power2.out",
                            onUpdate: function () {
                                const value = Math.round(this.progress() * 5);
                                statsRefs.current.conflicts.textContent = `${value}x`;
                            },
                            onComplete: () => {
                                statsRefs.current.conflicts.textContent = '5x';
                            }
                        });

                        // Animate Speed (12s)
                        gsap.to({}, {
                            duration: 1.5,
                            delay: 0.4,
                            ease: "power2.out",
                            onUpdate: function () {
                                const value = Math.round(this.progress() * 12);
                                statsRefs.current.speed.textContent = `${value}s`;
                            },
                            onComplete: () => {
                                statsRefs.current.speed.textContent = '12s';
                            }
                        });

                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(sectionRef.current);

            // Cleanup
            return () => {
                observer.disconnect();
            };
        }, 100); // Small delay to ensure DOM is ready

        return () => clearTimeout(timer);
    }, []);







    return (
        <div style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}>

            <nav className={`fixed w-full z-50 transition-all hover:shadow-sm duration-500 ${scorlled ? "bg-white/80 backdrop-blur-sm border-b border-white/30 py-4" : "bg-transparent py-4"
                }`}>
                <div className='container mx-auto px-4'>
                    <div className="flex items-center justify-between md:px-0 px-5">
                        {/* Logo */}
                        <div className='flex items-center space-x-2 cursor-pointer' onClick={() => navigate('/')}>
                            <div className='w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center'>
                                <span className='text-white font-bold text-xl'>B</span>
                            </div>
                            <span className='text-xl font-bold font-spaceGrotesk bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'>
                                BlogApp
                            </span>
                        </div>

                        {/* Desktop Buttons */}
                        <div className='hidden md:flex items-center space-x-8'>
                            <button
                                className="px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </button>
                            <button
                                className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition-all"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </div>

                        {/* Hamburger Icon - FIXED LOGIC */}
                        <button
                            className="md:hidden text-xl z-50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="text-gray-800" />
                            ) : (
                                <FiMenu className="text-gray-800" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu - FULLY ISOLATED FROM SCROLL */}

                </div>
            </nav>


            <div>
                {mobileMenuOpen && (
                    <div
                        className="md:hidden fixed inset-0 z-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {/* Solid backdrop (no transparency issues) */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                        {/* Opaque menu panel */}
                        <div
                            className="absolute right-0 top-0 w-3/4 h-full bg-white backdrop-blur-0 border-l border-white/30 p-6 flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-800 hover:text-gray-600"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-6 mt-8">
                                <button
                                    className="text-left py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-gray-800 font-medium"
                                    onClick={() => {
                                        navigate('/signup');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Sign Up
                                </button>

                                <button
                                    className="text-left py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold"
                                    onClick={() => {
                                        navigate('/login');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


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
                <div ref={heroRef} className="container mt-8 md:mt-0 mx-auto px-4 py-16 md:py-24 lg:py-32">
                    <div className="max-w-3xl mx-auto text-center mb-4">
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

                {/* AI Integration Section */}
                <div className="py-32">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
                            {/* 3D AI Model (Lottie) */}
                            {/* 3D AI Brain */}
                            <motion.div
                                className="w-full lg:w-1/2"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <Tilt
                                    tiltMaxAngleX={8}
                                    tiltMaxAngleY={8}
                                    scale={1.03}
                                    transitionSpeed={800}
                                    glareEnable={true}
                                    glareMaxOpacity={0.3}
                                    glareColor="rgba(255, 255, 255, 0.3)"
                                    className=" ai-model-glow rounded-3xl overflow-hidden"
                                >
                                    <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-white/30 backdrop-blur-sm p-4">
                                        <Lottie
                                            animationData={aiAnimation}
                                            loop={true}
                                            className="w-full h-80"
                                        />
                                    </div>
                                </Tilt>
                            </motion.div>

                            {/* AI Features */}
                            <div className="w-full lg:w-1/2">
                                <motion.h2
                                    className="text-3xl md:text-4xl font-bold font-spaceGrotesk mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    AI-Powered Blog Writing
                                </motion.h2>

                                <motion.p
                                    className="text-gray-600 mb-8 font-inter"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    Generate draft blog posts in seconds using OpenRouter AI models.
                                    Perfect for overcoming writer's block or creating content faster.
                                </motion.p>

                                {/* AI Workflow Steps */}
                                <div className="space-y-6">
                                    {[
                                        { step: "1", title: "Describe Your Idea", desc: "Enter a topic or keywords" },
                                        { step: "2", title: "AI Generates Draft", desc: "Get a full blog post in 10 seconds" },
                                        { step: "3", title: "Collaborate & Edit", desc: "Refine with your team in real-time" }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start gap-4 p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                                                {item.step}
                                            </div>
                                            <div>
                                                <h3 className="font-bold font-spaceGrotesk">{item.title}</h3>
                                                <p className="text-gray-600 text-sm font-inter">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                <div className='py-32 relative'>
                    <div className='absolute inset-0 bg-gradient-to-b from-cyan-50/20 to-indigo-50/20 -z-10'>

                    </div>

                    <div className='container mx-auto px-4'>
                        <div className='text-center mb-20'>
                            <motion.h2 className='text-3xl md:text-4xl font-bold font-spaceGrotesk mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}

                            >
                                Built for Teams That Ship Fast
                            </motion.h2>
                            <motion.p className='text-gray-600 max-w-2xl font-inter mx-auto'
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                Real metrics from teams using our platform
                            </motion.p>
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-24' ref={sectionRef}>
                            {
                                [
                                    { id: 'time', value: 70, suffix: '%', label: 'Faster Drafting', desc: 'Reduce writing time with AI + real-time collab' },
                                    { id: 'conflicts', value: 5, suffix: 'x', label: 'Fewer Conflicts', desc: 'No more version chaos or lost edits' },
                                    { id: 'speed', value: 12, suffix: 's', label: 'AI Draft Speed', desc: 'First draft generated in seconds' }
                                ].map((stat, i) => (
                                    <motion.div key={stat.id} className='card bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300'
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className='flex justify-center mb-4'>
                                            <div className='w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 items-center justify-center'>
                                                <span className='text-2xl font-bold text-white'>
                                                    {stat.suffix === '%' ? '⏱️' : stat.suffix === 'x' ? '🤝' : '🤖'}
                                                </span>
                                            </div>

                                        </div>

                                        <div className='font-spaceGrotesk'>
                                            <span
                                                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600"
                                                ref={(el) => { if (el) statsRefs.current[stat.id] = el; }}
                                            >
                                                0{stat.suffix}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-xl my-2 font-spaceGrotesk">{stat.label}</h3>
                                        <p className="text-gray-600 text-sm font-inter">{stat.desc}</p>
                                    </motion.div>
                                ))}
                        </div>

                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                                <h3 className="text-xl font-bold font-spaceGrotesk text-center mb-6">
                                    Collaboration: Before vs After
                                </h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-500 mb-2 flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            Before
                                        </h4>
                                        <div className="bg-red-50/30 border border-red-200 rounded-lg p-4 text-sm">
                                            <div className="font-bold mb-1">final_draft_v3_REALLYFINAL.docx</div>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>12 versions of the same doc</li>
                                                <li>Lost comments in email chains</li>
                                                <li>4 hours spent merging edits</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-green-500 mb-2 flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            After
                                        </h4>
                                        <div className="bg-green-50/30 border border-green-200 rounded-lg p-4 text-sm">
                                            <div className="font-bold mb-1">Real-time collaboration</div>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Single source of truth</li>
                                                <li>Live cursor visibility</li>
                                                <li>AI drafts in 12 seconds</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>



                    </div>

                </div>



                <AIdemo />

                <RealTimeCollabSection/>









            </div>

        </div>
    );

}

