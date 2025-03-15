import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage(data.message);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <section className="section-light py-12 px-6 md:px-8 text-center bg-burgundy">
      <h4 className="text-2xl md:text-3xl font-serif text-brandGold mb-4">
        Rejoignez Le Cercle Diamant Rouge
      </h4>
      <p className="text-platinumGray max-w-xl mx-auto mb-6">
        Recevez nos invitations privées et découvrez nos nouveautés en avant-première.
      </p>
      <form className="max-w-md mx-auto flex" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Votre adresse e-mail"
          className="input-field flex-1 rounded-r-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-burgundy hover:bg-brandGold text-brandIvory hover:text-richEbony px-4 py-2 rounded-r-lg transition duration-300"
        >
          S’inscrire
        </button>
      </form>
      {message && <p className="mt-4 text-brandGold">{message}</p>}
    </section>
  );
}