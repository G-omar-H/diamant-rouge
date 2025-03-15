// components/admin/ManageNewsletter.tsx
import { useState, useEffect } from "react";

type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendStatus, setSendStatus] = useState("");

  // Fetch subscribers from API
  useEffect(() => {
    async function fetchSubscribers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/newsletter");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch subscribers.");
        }
        const data = await res.json();
        setSubscribers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscribers();
  }, []);

  function toggleSelect(email: string) {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  }

  function selectAll() {
    setSelectedEmails(subscribers.map((s) => s.email));
  }

  function deselectAll() {
    setSelectedEmails([]);
  }

  async function handleSendMassEmail(e: React.FormEvent) {
    e.preventDefault();
    setSendStatus("");
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          recipients: selectedEmails, // if empty, endpoint will send to all
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendStatus(data.error || "Failed to send emails.");
      } else {
        setSendStatus("Emails sent successfully!");
        // Optionally, clear selections
        setSelectedEmails([]);
        setSubject("");
        setMessage("");
      }
    } catch (error: any) {
      setSendStatus("Error sending emails.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-serif text-brandGold mb-6">Manage Newsletter</h1>

      {loading && <p>Loading subscribers...</p>}
      {error && <p className="text-burgundy">{error}</p>}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Subscribers</h2>
        <button onClick={selectAll} className="mr-4 px-4 py-2 bg-brandGold text-richEbony rounded">
          Select All
        </button>
        <button onClick={deselectAll} className="px-4 py-2 bg-burgundy text-brandIvory rounded">
          Deselect All
        </button>
        <ul className="mt-4">
          {subscribers.map((subscriber) => (
            <li key={subscriber.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedEmails.includes(subscriber.email)}
                onChange={() => toggleSelect(subscriber.email)}
              />
              <span>{subscriber.email}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Send Mass Email</h2>
        <form onSubmit={handleSendMassEmail}>
          <div className="mb-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-brandGold text-richEbony rounded">
            Send Email
          </button>
        </form>
        {sendStatus && <p className="mt-4 text-brandGold">{sendStatus}</p>}
      </div>
    </div>
  );
}
