import Hero from "../components/Hero";
import ExperienceGrid from "../components/ExperienceGrid";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ExperienceGrid />
      <Contact />
      <Footer />
    </main>
  );
}
