import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Main JavaScript File
 * Harshit Shukla - Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'ph ph-sun';
        } else {
            themeIcon.className = 'ph ph-moon';
        }
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileMenuBtn.querySelector('i');

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('open');
        if (mobileMenu.classList.contains('open')) {
            menuIcon.className = 'ph ph-x';
        } else {
            menuIcon.className = 'ph ph-list';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // 3. Sticky Navbar & Scroll Spy
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky nav
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll spy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Scroll Animations (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 5. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        card.style.display = 'flex';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                }
            });
        });
    });

    // 6. Hero Canvas Animation (Nodes connecting)
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            
            const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100);
            
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        function animateCanvas() {
            requestAnimationFrame(animateCanvas);
            ctx.clearRect(0, 0, width, height);
            
            const isDark = htmlEl.getAttribute('data-theme') === 'dark';
            const particleColor = isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.3)';
            const lineColor = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)';

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                // Connect particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1 - (distance / 150);
                        ctx.stroke();
                    }
                }
            });
        }

        initCanvas();
        animateCanvas();

        window.addEventListener('resize', initCanvas);
    }

    // 7. AI Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('open');
        if(chatbotWindow.classList.contains('open')){
            chatInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
    });

    chatbotOverlay.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
    });

    // Real AI Chatbot Logic using Google Generative AI (Gemini)
    const API_KEY = "AIzaSyDK7OcVzFzrsDWFhAfYFN2j1LQfVcNPLg4";
    let genAI = null;
    let generativeModel = null;

    const resumeData = `
Name: Harshit Shukla
Role: Backend Engineer | AI Developer | Microservices Architect
Location: Chandigarh, India
Phone: +91 9670534311
Email: harshitshukla1124@gmail.com
Links: LinkedIn (harshit-shukla01), GitHub (harshitshukla200)

Professional Summary:
Backend Developer with strong expertise in building scalable distributed systems and high-performance cloud-native applications. Skilled in Python, FastAPI, Microservices, Event-Driven Architecture, and GCP. Experienced in integrating Generative AI (LLMs, RAG) into production workflows, and working with Docker, Kubernetes, and modern DevOps pipelines.

Skills:
- Languages: Python, SQL
- AI & Generative AI: Prompt Engineering, LLMs, LangChain, LangGraph, RAG, NLP, Deep Learning
- Frameworks & Libraries: Django, Flask, FastAPI, TensorFlow, Keras, PyTorch, Scikit-learn, Pandas, NumPy, Matplotlib
- Databases & Tools: Apache Kafka, MySQL, MongoDB, Firebase, Git, Postman, VS Code, JIRA
- DevOps & Cloud: GCP, AWS, Docker, Kubernetes, CI/CD, Nginx

Experience:
- Software Engineer L3 at Connecting Points Tech (Sept 2025 - Present): Reduced API response time by 20% using optimized Python + Firebase backend. Built scalable microservices architecture.
- Software Developer Intern at Concientech IT Solution (June 2025 - Sept 2025): Built scalable APIs, Angular 17 UI, integrated LLM chatbot.
- Web Developer Intern at GAOTek Inc. (July 2024 - Oct 2024): Built functional modules using React & WordPress.

Projects:
1. TemporalAI: Event-Driven Microservices Platform (React + FastAPI + Kafka + Firebase + Docker)
2. AI Interviewer Platform: AI-powered mock interview system using NLP & LLM (Django + Angular)
3. Cash Management System (REATIV): Banking system for liquidity monitoring (REST APIs + Firebase)

Education:
MCA - Graphic Era Hill University (2023-2025)
B.Sc - VBS Purvanchal University (2020-2023)
`;

    const systemPrompt = `You are a helpful and professional AI assistant for Harshit Shukla's portfolio website. 
Your goal is to answer questions about Harshit accurately and concisely using ONLY the following resume data. 
If a user asks a question that cannot be answered using the resume data, politely tell them that you don't know the answer but they can contact Harshit directly via email at harshitshukla1124@gmail.com. 
Keep your responses short, friendly, and conversational (1-3 sentences maximum). Do not use markdown formatting like bolding or bullet points unless necessary for a list.

Resume Data:
${resumeData}`;

    try {
        genAI = new GoogleGenerativeAI(API_KEY);
        // Initialize the model
        generativeModel = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });
    } catch (error) {
        console.error("Failed to initialize Google Generative AI:", error);
    }

    // Simple local fallback AI logic
    function generateFallbackResponse(query) {
        query = query.toLowerCase();
        
        if (query.includes('hello') || query.includes('hi ') || query === 'hi') {
            return "Hello! I'm Harshit's AI assistant. Ask me about his experience, skills, or projects!";
        } else if (query.includes('experience') || query.includes('work') || query.includes('job')) {
            return "Harshit is currently a Software Engineer L3 at Connecting Points Tech. Previously, he interned at Concientech IT Solution and GAOTek Inc. as a Web/Software Developer.";
        } else if (query.includes('skill') || query.includes('tech') || query.includes('stack')) {
            return "Harshit specializes in Backend & AI. His skills include Python, SQL, FastAPI, Django, LLMs, LangChain, Apache Kafka, Docker, and Kubernetes.";
        } else if (query.includes('project') || query.includes('portfolio')) {
            return "Some of his notable projects include TemporalAI (Event-Driven Microservices), an AI Interviewer Platform, and a Cash Management System (REATIV).";
        } else if (query.includes('education') || query.includes('degree') || query.includes('college')) {
            return "Harshit holds an MCA from Graphic Era Hill University (2023-2025) and a B.Sc from VBS Purvanchal University (2020-2023).";
        } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('hire')) {
            return "You can reach Harshit via email at harshitshukla1124@gmail.com or by phone at +91 9670534311. His LinkedIn is harshit-shukla01.";
        } else if (query.includes('who is') || query.includes('about')) {
            return "Harshit Shukla is a Backend Engineer and AI Developer based in Chandigarh, India, skilled in building scalable distributed systems and GenAI applications.";
        } else {
            return "I'm not sure about that. But you can reach out to Harshit directly via email at harshitshukla1124@gmail.com for more details!";
        }
    }

    async function handleChatSubmit() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingId = addTypingIndicator();

        try {
            if (!generativeModel) {
                throw new Error("Model not initialized");
            }
            
            // Call Gemini API
            const fullPrompt = `${systemPrompt}\n\nUser Question: ${text}`;
            const result = await generativeModel.generateContent(fullPrompt);
            const response = await result.response;
            const textResponse = response.text();
            
            removeMessage(typingId);
            addMessage(textResponse, 'bot');
        } catch (error) {
            console.error("Gemini API Error, using fallback:", error);
            
            // Use robust local fallback if API fails
            setTimeout(() => {
                const fallbackResponse = generateFallbackResponse(text);
                removeMessage(typingId);
                addMessage(fallbackResponse, 'bot');
            }, 1000); // Add a small delay to simulate thinking
        }
    }

    function addMessage(text, sender, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.textContent = text;
        if (id) {
            msgDiv.id = id;
        }
        chatMessages.appendChild(msgDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.id = id;
        msgDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    chatSubmit.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });
});
