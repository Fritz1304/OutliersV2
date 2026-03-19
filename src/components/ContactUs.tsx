import { useState, useRef } from "react";
import gsap from "gsap";

export default function ContactUs() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Refs for GSAP animations
    const formRef = useRef<HTMLFormElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const formContentRef = useRef<HTMLDivElement>(null);

    const animateSuccess = () => {
        const tl = gsap.timeline();
        
        // Hide form content
        tl.to(formContentRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.inOut",
            display: "none"
        });

        // Show success overlay
        tl.set(successRef.current, { display: "flex", opacity: 0, scale: 0.9 });
        tl.to(successRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });

        // Stagger inner success elements
        tl.fromTo(".success-item", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" },
            "-=0.2"
        );
    };

    const resetFormAnimation = () => {
        const tl = gsap.timeline();
        
        tl.to(successRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in",
            display: "none"
        });

        tl.set(formContentRef.current, { display: "block" });
        tl.to(formContentRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Button pop animation on submit
        gsap.fromTo(e.currentTarget.querySelector('button[type="submit"]'),
            { scale: 0.95 },
            { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );

        setIsSubmitting(true);
        
        const form = e.currentTarget;
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    Accept: "application/json",
                },
            });
            
            if (response.ok) {
                form.reset();
                animateSuccess();
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="w-full pt-12 pb-24 px-4 bg-white dark:bg-black relative z-10 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Contáctanos</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        ¿Listo para llevar tu proyecto al siguiente nivel? Escríbenos y hagamos algo increíble juntos.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Address */}
                    <div className="flex flex-col items-center p-8 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-[rgb(224,77,96)]/30 dark:hover:border-white/10 dark:hover:bg-neutral-900/80 transition-all duration-300 group shadow-sm z-[1]">
                        <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[rgb(224,77,96)] group-hover:text-white dark:group-hover:bg-white/10 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dirección</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center">Aguazul Casanare</p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col items-center p-8 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-[rgb(224,77,96)]/30 dark:hover:border-white/10 dark:hover:bg-neutral-900/80 transition-all duration-300 group shadow-sm z-[1]">
                        <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[rgb(224,77,96)] group-hover:text-white dark:group-hover:bg-white/10 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Teléfono</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center">+57 xxx xxx xxxx</p>
                    </div>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-4 mt-14 mb-2 z-[1]">
                    <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
                    <span className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                        Escríbenos
                    </span>
                    <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
                </div>

                <form
                    ref={formRef}
                    action="https://formly.email/submit"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="relative bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-white/5 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl dark:shadow-[rgb(224,77,96)]/5 dark:hover:shadow-[rgb(224,77,96)]/10 transition-shadow duration-500 overflow-hidden min-h-[450px]"
                >
                    {/* Success Overlay state */}
                    <div 
                        ref={successRef} 
                        className="absolute inset-0 hidden flex-col items-center justify-center p-8 bg-white dark:bg-neutral-900 z-20 text-center"
                    >
                        <div className="success-item w-20 h-20 bg-[rgb(224,77,96)]/10 dark:bg-[rgb(224,77,96)]/20 text-[rgb(224,77,96)] rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        </div>
                        <h3 className="success-item text-3xl font-bold text-gray-900 dark:text-white mb-2">¡Mensaje Enviado!</h3>
                        <p className="success-item text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                            Gracias por escribirnos. Nuestro equipo revisará tu mensaje y se pondrá en contacto contigo en breve.
                        </p>
                        <button 
                            type="button"
                            onClick={resetFormAnimation}
                            className="success-item bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-300"
                        >
                            Enviar otro mensaje
                        </button>
                    </div>

                    {/* Actual Form Content */}
                    <div ref={formContentRef} className="flex flex-col gap-6">
                    <div className="mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Envíanos un mensaje</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Te respondemos en menos de 24 horas.</p>
                    </div>
                    <input type="hidden" name="access_key" value="5e47d9d4b92843b8b521a74ff88f27b2" />
                    <input
                        type="text"
                        name="company"
                        style={{ display: "none" }}
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                                Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Tu nombre"
                                required
                                className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[rgb(224,77,96)] dark:focus:border-[rgb(224,77,96)] transition-colors duration-300"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="tu@correo.com"
                                required
                                className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[rgb(224,77,96)] dark:focus:border-[rgb(224,77,96)] transition-colors duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Cuéntanos sobre tu proyecto..."
                            required
                            className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[rgb(224,77,96)] dark:focus:border-[rgb(224,77,96)] transition-colors duration-300 resize-none"
                        />
                    </div>

                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 
                                ${isSubmitting ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-gray-500 text-black hover:bg-[rgb(224,77,96)] hover:text-white hover:scale-105"}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </>
                            ) : (
                                "Enviar mensaje"
                            )}
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </section>
    );
}