// components/Footer.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  FaTwitter, FaGithub, FaLinkedin, FaDiscord 
} from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';


gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const iconRefs = useRef([]);
  const columnRefs = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Footer fade-in on scroll
    const footerTL = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        toggleActions: "play none none none"
      }
    });

    footerTL.from(footer, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out"
    });

    // Animate columns
    columnRefs.current.forEach((col, i) => {
      footerTL.from(col, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        delay: i * 0.1
      }, "-=0.8");
    });

    // Animate social icons
    iconRefs.current.forEach((icon, i) => {
      footerTL.from(icon, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: i * 0.1
      }, "-=0.5");
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const socialLinks = [
    { Icon: FaTwitter, href: "https://twitter.com/yourhandle", label: "Twitter" },
    { Icon: FaGithub, href: "https://github.com/yourhandle", label: "GitHub" },
    { Icon: FaLinkedin, href: "https://linkedin.com/in/yourhandle", label: "LinkedIn" },
    { Icon: FaDiscord, href: "https://discord.gg/yourserver", label: "Discord" }
  ];

  const footerLinks = {
    Product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Templates", href: "/templates" },
      { name: "Changelog", href: "/changelog" }
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/docs" },
      { name: "Guides", href: "/guides" },
      { name: "API Status", href: "/status" }
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" }
    ]
  };

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-t from-white/5 to-indigo-50/20 backdrop-blur-xl border-t border-white/30 pt-24 pb-12 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div 
            ref={el => columnRefs.current[0] = el}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold font-spaceGrotesk bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                BlogApp
              </span>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-md">
              The future of collaborative blogging. Write, edit, and publish together in real-time.
            </p>
            
            {/* Email Input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <div 
              key={category}
              ref={el => columnRefs.current[idx + 1] = el}
            >
              <h3 className="font-bold text-lg mb-6 font-spaceGrotesk text-gray-800">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <motion.li 
                    key={link.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.div
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              © {new Date().getFullYear()} BlogApp. All rights reserved.
            </motion.div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  ref={el => iconRefs.current[i] = el}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/30 flex items-center justify-center text-gray-700 hover:text-indigo-600 transition-all"
                  whileHover={{ 
                    y: -5,
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Contact Email */}
            <div className="flex items-center space-x-2 text-gray-600">
              <FiMail className="w-5 h-5" />
              <span>contact@blogapp.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx="true">{`
        .font-spaceGrotesk { 
          font-family: 'Space Grotesk', sans-serif; 
        }
      `}</style>
    </footer>
  );
}