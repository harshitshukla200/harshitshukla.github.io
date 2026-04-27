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
            model: "gemini-flash-latest"
        });
    } catch (error) {
        console.error("Failed to initialize Google Generative AI:", error);
    }

    async function handleChatSubmit() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        chatInput.value = '';

        // Check if model initialized
        if (!generativeModel) {
            addMessage("Sorry, the AI is currently offline due to a configuration error.", 'bot');
            return;
        }

        // Show typing indicator
        const typingId = addTypingIndicator();

        try {
            // Append system context to user prompt since gemini-pro might not support systemInstruction natively
            const fullPrompt = `${systemPrompt}\n\nUser Question: ${text}`;
            
            // Call Gemini API
            const result = await generativeModel.generateContent(fullPrompt);
            const response = await result.response;
            const textResponse = response.text();
            
            // Remove typing indicator and add response
            removeMessage(typingId);
            addMessage(textResponse, 'bot');
        } catch (error) {
            console.error("Gemini API Error:", error);
            removeMessage(typingId);
            addMessage("Sorry, I encountered a technical issue while fetching the response. Please try again or reach out to Harshit directly!", 'bot');
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
        addMessage("Thinking...", 'bot', id);
        return id;
    }

    chatSubmit.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });
});
