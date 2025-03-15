// pages/admin/index.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { ManageProducts } from "../../components/admin/ManageProducts";
import { ManageCategories } from "../../components/admin/ManageCategories";
import { ManageOrders } from "../../components/admin/ManageOrders";
import { ManageUsers } from "../../components/admin/ManageUsers";
import { ManageNewsletter } from "../../components/admin/ManageNewsletter";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "users" | "newsletter">("products");

  return (
    <section className="section-light min-h-screen p-8">
      <h1 className="text-3xl font-serif text-brandGold mb-6">Admin Dashboard</h1>
      <p className="text-platinumGray mb-8">
        Bienvenue sur la plateforme d'administration Diamant-Rouge.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "products" ? "bg-brandGold text-richEbony" : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"}`}
        >
          Produits
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "categories" ? "bg-brandGold text-richEbony" : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"}`}
        >
          Catégories
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "orders" ? "bg-brandGold text-richEbony" : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"}`}
        >
          Commandes
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "users" ? "bg-brandGold text-richEbony" : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"}`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setActiveTab("newsletter")}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === "newsletter" ? "bg-brandGold text-richEbony" : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"}`}
        >
          Newsletter
        </button>
      </div>

      {activeTab === "products" && <ManageProducts />}
      {activeTab === "categories" && <ManageCategories />}
      {activeTab === "orders" && <ManageOrders />}
      {activeTab === "users" && <ManageUsers />}
      {activeTab === "newsletter" && <ManageNewsletter />}
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || session.user.role !== "admin") {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  return { props: {} };
};
