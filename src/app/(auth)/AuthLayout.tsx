'use client'

import AuthWaveform from "@/components/ui/AuthWaveform";

const QUOTES = [
    "\u201cFound my running club here before I found it in real life.\u201d",
    "\u201cThe group chat that actually replaced our group chat.\u201d",
    "\u201cVoxa is where our book club argues now.\u201d",
];

interface AuthLayoutProps {
    eyebrow: string;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    wide?: boolean;
}

export default function AuthLayout({ eyebrow, title, description, children, footer, wide }: AuthLayoutProps) {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-paper dark:bg-ink">
            <aside className="relative lg:w-[42%] bg-ink text-paper flex flex-col justify-between px-8 py-10 lg:px-12 lg:py-14">
                <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display, 'Fraunces', serif)" }}>
            Voxa
          </span>
                </div>

                <div className="hidden lg:flex flex-col gap-8 mt-16">
                    <AuthWaveform />
                    <p className="text-lg leading-relaxed text-paper/85 max-w-sm" style={{ fontFamily: "var(--font-display, 'Fraunces', serif)" }}>
                        {quote}
                    </p>
                </div>

                <p className="hidden lg:block text-xs text-paper/45">
                    Conversations that sound like people, not feeds.
                </p>
            </aside>

            <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
                <div className={`w-full ${wide ? "max-w-xl" : "max-w-sm"}`}>
                    <p className="text-xs font-medium tracking-wide uppercase text-primary mb-2">
                        {eyebrow}
                    </p>
                    <h1 className="text-2xl font-semibold text-ink dark:text-paper mb-1" style={{ fontFamily: "var(--font-display, 'Fraunces', serif)" }}>
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-fog mb-8 leading-relaxed">{description}</p>
                    )}
                    {!description && <div className="mb-6" />}

                    {children}

                    {footer && <div className="mt-8 text-center text-sm text-fog">{footer}</div>}
                </div>
            </main>
        </div>
    );
}