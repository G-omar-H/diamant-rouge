import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AppointmentPage() {
    const [selectedLocation, setSelectedLocation] = useState("casablanca");
    const [selectedType, setSelectedType] = useState("");

    return (
        <>
            <NextSeo
                title="The House of Diamant Rouge | Private Appointment"
                description="Enter the world of The House of Diamant Rouge with a private appointment in our Casablanca showroom or an exclusive virtual consultation."
                openGraph={{
                    title: "The House of Diamant Rouge | Private Appointment",
                    description:
                        "Enter the world of The House of Diamant Rouge with a private appointment in our Casablanca showroom or an exclusive virtual consultation.",
                }}
            />

            {/* Hero Section with an overlayed image */}
            <section className="relative h-[700px] flex items-center justify-center text-center">
                {/* Background Image */}
                <Image
                    src="/images/showroom.jpg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    alt="Diamant Rouge Showroom"
                    className="z-0 opacity-40"
                />
                {/* Subtle Burgundy Overlay */}
                <div className="absolute inset-0 bg-burgundy/50 z-0" />

                {/* Hero Text */}
                <div className="relative z-10 px-6">
                    <h1 className="text-5xl md:text-7xl font-serif text-brandGold">
                        A Timeless Rendezvous
                    </h1>
                    <p className="mt-4 text-xl text-platinumGray max-w-3xl mx-auto">
                        Step into a world of luxury, refinement, and bespoke craftsmanship.
                    </p>
                </div>
            </section>

            {/* Personalized Consultation Section */}
            <section className="section-light max-w-5xl mx-auto py-16 px-6 text-center">
                <h2 className="text-3xl font-serif text-brandGold">
                    Your Private Consultation
                </h2>
                <p className="text-platinumGray mt-4">
                    Each guest is welcomed by a <strong>dedicated gemologist</strong>,
                    guiding you towards creating a timeless masterpiece.
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
                    {/* Casablanca Button */}
                    <button
                        onClick={() => setSelectedLocation("casablanca")}
                        className={`px-6 py-3 rounded-full text-lg font-medium transition duration-300
              ${
                            selectedLocation === "casablanca"
                                ? "bg-brandGold text-richEbony shadow-luxury scale-105"
                                : "bg-brandIvory border border-brandGold text-richEbony hover:brightness-105"
                        }
            `}
                    >
                        Casablanca - Private Showroom
                    </button>

                    {/* Virtual Consultation Button */}
                    <button
                        onClick={() => setSelectedLocation("virtual")}
                        className={`px-6 py-3 rounded-full text-lg font-medium transition duration-300
              ${
                            selectedLocation === "virtual"
                                ? "bg-brandGold text-richEbony shadow-luxury scale-105"
                                : "bg-brandIvory border border-brandGold text-richEbony hover:brightness-105"
                        }
            `}
                    >
                        Virtual Consultation
                    </button>
                </div>

                <p className="mt-6 text-lg font-medium text-brandGold">
                    Selected:{" "}
                    <span className="text-richEbony">
            {selectedLocation === "casablanca"
                ? "Casablanca Showroom"
                : "Virtual Consultation"}
          </span>
                </p>
            </section>

            {/* The Experience Section */}
            <motion.section
                className="section-light grid grid-cols-1 md:grid-cols-2 gap-12 px-6 max-w-6xl mx-auto py-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <div>
                    <Image
                        src="/images/gemologist.jpg"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-luxury w-full"
                        alt="Diamant Rouge Gemologist"
                    />
                </div>
                <div>
                    <h3 className="text-3xl font-serif text-brandGold mb-4">
                        The Diamant Rouge Journey
                    </h3>
                    <p className="text-platinumGray">
                        A <strong>rare and intimate moment</strong> where you can{" "}
                        <strong>observe, touch</strong>, and{" "}
                        <strong>immerse yourself</strong> in a world of exquisite creations.
                    </p>
                    <ul className="mt-6 text-lg text-richEbony space-y-2 list-disc list-inside">
                        <li>
                            <strong>Private session</strong> with a master gemologist
                        </li>
                        <li>
                            Discover the artistry behind each diamond
                        </li>
                        <li>
                            Experience an exclusive try-on session
                        </li>
                        <li>
                            Bespoke customization and expert guidance
                        </li>
                    </ul>
                </div>
            </motion.section>

            {/* Booking Form */}
            <section className="section-light max-w-4xl mx-auto py-16 px-6 text-center">
                <h2 className="text-3xl font-serif text-brandGold">
                    Book Your Private Appointment
                </h2>
                <p className="text-platinumGray mt-4">
                    Select your preferred consultation and enter the world of{" "}
                    <strong>The House of Diamant Rouge</strong>.
                </p>

                <div className="mt-6 max-w-md mx-auto">
                    <select
                        className="input-field w-full text-lg"
                        value={selectedType}
                        onChange={(e) => {
                            setSelectedType(e.target.value);
                        }}
                    >
                        <option value="">Select Your Appointment Type</option>
                        <option value="try-on">Try On Creations in Showroom</option>
                        <option value="custom">Bespoke Jewelry Consultation</option>
                    </select>
                </div>

                <div className="mt-8">
                    <Link href="/booking">
                        <button
                            className={`button-primary px-6 py-3 ${
                                selectedType ? "" : "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!selectedType}
                        >
                            Book Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* Secure & Hassle-Free Section */}
            <section className="section-dark py-12 text-center">
                <h3 className="text-2xl font-serif">
                    An Experience Without Compromise
                </h3>
                <p className="text-platinumGray mt-2 max-w-xl mx-auto">
                    Every appointment is{" "}
                    <strong>complimentary and obligation-free</strong>, ensuring an
                    experience that is as seamless as it is luxurious.
                </p>
            </section>
        </>
    );
}
