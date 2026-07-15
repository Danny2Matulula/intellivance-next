import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="not-found">
        <div>
          <strong>404</strong>
          <h1>This route went somewhere else.</h1>
          <p>The page may have moved while we rebuilt the site.</p>
          <Link className="button button-primary" href="/">
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
