import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <Navbar />
            <main className="pt-16 min-h-[80vh] flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="mono text-xs text-neutral-500 mb-6 tracking-widest">
                        [ ERROR_404 ]
                    </div>
                    <h1 className="text-6xl font-medium tracking-tight mb-4">404</h1>
                    <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
                        This page doesn&apos;t exist — but your AI roadmap could.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/"
                            className="btn-tech"
                        >
                            Go Home
                        </Link>
                        <Link
                            href="/assessment"
                            className="bg-neutral-900 text-[#EAEAE5] px-6 py-3 mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                        >
                            Start Assessment
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
