// pages/about.tsx
import Head from "next/head";

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>About Diamant-Rouge</title>
            </Head>
            <main className="section-light hero-section min-h-screen p-8 max-w-3xl mx-auto">
                <h1 className="text-4xl font-serif text-brandGold mb-6">Our Story</h1>
                <p className="mb-4 text-platinumGray leading-relaxed">
                    Founded in the heart of Paris, Diamant-Rouge has been crafting exquisite jewelry since
                    19XX. Our commitment to unparalleled artistry and precision has earned us recognition
                    among connoisseurs worldwide.
                </p>
                <p className="mb-4 text-platinumGray leading-relaxed">
                    Every gemstone is carefully selected, and each design tells a story of French heritage
                    and modern allure. From the ateliers of Paris to red carpets around the globe,
                    Diamant-Rouge stands as a symbol of timeless elegance.
                </p>

                {/* Authority Cue: Awards, Certification */}
                <h2 className="text-2xl font-serif text-brandGold mt-8 mb-4">Awards & Recognition</h2>
                <ul className="list-disc list-inside text-richEbony space-y-2">
                    <li>Member of the French Jewelry Federation</li>
                    <li>Featured in Vogue, Elle, and Harper's Bazaar</li>
                    <li>Best Luxury Design House 2025 - Paris Style Awards</li>
                </ul>
            </main>
        </>
    );
}
