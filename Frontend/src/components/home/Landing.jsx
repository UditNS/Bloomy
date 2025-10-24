import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, MessageCircle, Heart, Sparkles, ArrowRight, CheckCircle, Zap, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const floatingRef = useRef([]);
  const parallaxRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced Hero Section Animation with stagger and bounce
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.from('.hero-title', {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'back.out(1.4)'
      })
      .from('.hero-subtitle', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero-buttons', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      }, '-=0.5')
      .from('.hero-image', {
        scale: 0.7,
        opacity: 0,
        rotation: -10,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      }, '-=1');

      // Central logo pulse
      gsap.to('.central-logo', {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Revolution animation (revolve around center)
      gsap.to('.revolution', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center'
      });

      // Rotation animation (spin each card)
      gsap.to('.orbiting-card', {
        rotation: -360, // Counter-rotate to keep icons upright
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      // Individual orbiting cards hover effect
      document.querySelectorAll('.orbiting-card').forEach((card, i) => {
        gsap.to(card, {
          y: '+=15',
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5
        });
      });

      // Enhanced Floating Elements with parallax
      floatingRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: '+=40',
            x: i % 2 === 0 ? '+=20' : '-=20',
            duration: 3 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.4
          });

          // Parallax scroll effect
          gsap.to(el, {
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            },
            y: i % 2 === 0 ? 200 : -200,
            ease: 'none'
          });
        }
      });

      // Features Section effect
      if (featuresRef.current) {
  const featureCards = featuresRef.current.querySelectorAll('.feature-card');

  if (featureCards.length > 0) {
    gsap.fromTo(
      featureCards,
      {
        y: 60,
        opacity: 0,
        rotateX: -15,
        scale: 0.95,
      },
      {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 1,
        stagger: {
          amount: 0.4, // smoother group entry
          ease: 'power2.out',
        },
        ease: 'power3.out',
        clearProps: 'all',
      }
    );
  }
}

      // Stats Counter Animation
      if (statsRef.current) {
        const statElements = statsRef.current.querySelectorAll('.stat-number');
        statElements.forEach((stat) => {
          const endValue = parseInt(stat.getAttribute('data-value')) || 0;
          const suffix = stat.getAttribute('data-suffix') || '';
          
          // Set initial value immediately
          stat.textContent = '0' + suffix;
          
          gsap.to(stat, {
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true
            },
            textContent: endValue,
            duration: 2.5,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              const value = Math.ceil(this.targets()[0].textContent);
              stat.textContent = value.toLocaleString() + suffix;
            }
          });
        });
      }

      // Stats items scale
      if (statsRef.current) {
        gsap.fromTo('.stat-item',
          {
            scale: 0.8,
            opacity: 0
          },
          {
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true
            },
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.4)'
          }
        );
      }
      //CTA
      if (ctaRef.current) {
        gsap.fromTo('.cta-content',
          {
            scale: 0.9,
            opacity: 0
          },
          {
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true
            },
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
          }
        );

        gsap.fromTo('.cta-badge',
          {
            scale: 0,
            opacity: 0,
            y: 20
          },
          {
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true
            },
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            delay: 0.3
          }
        );
      }

      // Parallax scroll for sections
      gsap.to('.parallax-section', {
        scrollTrigger: {
          trigger: '.parallax-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -50,
        ease: 'none'
      });

      // Add shine effect on buttons
      document.querySelectorAll('.shine-button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          gsap.fromTo(btn.querySelector('.shine'),
            { x: '-100%' },
            { x: '100%', duration: 0.6, ease: 'power2.inOut' }
          );
        });
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'AI-powered algorithms connect you with people who share your interests, skills, and goals.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Instant messaging with rich media support and seamless conversation flow.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Heart,
      title: 'Build Connections',
      description: 'Grow your network authentically with meaningful professional relationships.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Personalized Experience',
      description: 'Customize every aspect of your profile to let your unique personality shine.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { number: '1000', label: 'Active Users', suffix: '+' },
    { number: '5000', label: 'Connections Made', suffix: '+' },
    { number: '10000', label: 'Messages Sent', suffix: '+' },
    { number: '98', label: 'Satisfaction Rate', suffix: '%' }
  ];

  return (
    <div ref={heroRef} className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            ref={el => floatingRef.current[0] = el}
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-rose-500/10 rounded-full blur-3xl"
          />
          <div 
            ref={el => floatingRef.current[1] = el}
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-3xl"
          />
          <div 
            ref={el => floatingRef.current[2] = el}
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl"
          />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="hero-title text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                Connect.
              </h1>
              <h1 className="hero-title text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-none animate-gradient bg-[length:200%_auto]">
                Collaborate.
              </h1>
              <h1 className="hero-title text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                Grow Together.
              </h1>
            </div>

            <p className="hero-subtitle text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Bloomy is where meaningful connections bloom. Join thousands of professionals building their network and finding opportunities that matter.
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="shine-button relative overflow-hidden text-lg px-10 py-7 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/signup')}
              >
                <span className="shine absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-7 border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-5 h-5 text-orange-500" />
                <span>Top Rated</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Enhanced */}
          <div className="hero-image relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-full blur-3xl"></div>
              
              {/* Central Circle with gradient border */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="central-logo relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-xl opacity-50"></div>
                  <div className="relative w-36 h-36 md:w-56 md:h-56 rounded-full bg-background/70 flex items-center justify-center shadow-2xl ring-4 ring-white/20">
                    <img src="/Bloomy_favicon.png" alt="Bloomy" className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Orbiting Cards with enhanced design */}
              {/* Orbiting Cards */}
              <div className="revolution absolute inset-0">
                {[
                  { icon: Users, color: 'from-pink-500 to-rose-500', solidColor: 'text-pink-500', angle: 0 },
                  { icon: MessageCircle, color: 'from-purple-500 to-indigo-500', solidColor: 'text-purple-500', angle: 90 },
                  { icon: Heart, color: 'from-blue-500 to-cyan-500', solidColor: 'text-blue-500', angle: 180 },
                  { icon: Sparkles, color: 'from-green-500 to-emerald-500', solidColor: 'text-green-500', angle: 270 }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="orbiting-card absolute w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-2xl bg-card border-2 border-border shadow-2xl flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-pointer group"
                      style={{
                        top: `${50 + 38 * Math.sin((item.angle * Math.PI) / 180)}%`,
                        left: `${50 + 38 * Math.cos((item.angle * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                      <Icon className={`relative z-10 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 ${item.solidColor} drop-shadow-lg`} strokeWidth={2} />
                    </div>
                  );
                })}
              </div>

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <circle cx="50%" cy="50%" r="38%" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="5,5">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </circle>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section ref={featuresRef} className="parallax-section py-32 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-sm font-semibold text-pink-600 dark:text-pink-400">
                ✨ Features
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Why Choose Bloomy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to build meaningful professional relationships, all in one beautiful platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card group relative bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border hover:border-primary/50"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Stats Section - Ultra Enhanced */}
      <section ref={statsRef} className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center" style={{ opacity: 1 }}>
                <div className="relative inline-block">
                  <div 
                    className="stat-number text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-4"
                    data-value={stat.number}
                    data-suffix={stat.suffix}
                  >
                    {stat.number.toLocaleString()}{stat.suffix}
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
          <div className='absolute bottom-2 right-6 text-sm font-light text-foreground/20'>* For representational purposes only</div>
        
      </section>

      {/* CTA Section - Ultimate */}
      <section ref={ctaRef} className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
        <div className="max-w-5xl mx-auto text-center cta-content" style={{ opacity: 1 }}>
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs sm:text-sm font-bold shadow-lg">
              🚀 Join Now
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-tight px-4 text-foreground">
            Ready to Bloom Your Network?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Join thousands of professionals building meaningful connections on Bloomy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
            <Button 
              size="lg" 
              className="text-base sm:text-lg md:text-xl px-8 sm:px-12 py-6 sm:py-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-2xl hover:scale-105 transition-all"
              onClick={() => navigate('/signup')}
            >
              Start Connecting Today
              <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 px-4">
            {[
              { icon: CheckCircle, text: 'Free to join', color: 'text-green-500' },
              { icon: CheckCircle, text: 'No credit card', color: 'text-blue-500' },
              { icon: CheckCircle, text: 'Instant access', color: 'text-purple-500' }
            ].map((badge, index) => {
              const BadgeIcon = badge.icon;
              return (
                <div 
                  key={index} 
                  className="cta-badge flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-card border shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  <BadgeIcon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${badge.color}`} />
                  <span className="text-xs sm:text-sm md:text-base font-medium text-foreground">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="py-16 px-4 border-t bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <img src="/Bloomy_favicon.png" alt="Bloomy" className="relative w-12 h-12 rounded-full shadow-lg" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Bloomy
            </span>
          </div>
          <p className="text-muted-foreground/60 text-sm mt-2">
            Where connections bloom into opportunities
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;