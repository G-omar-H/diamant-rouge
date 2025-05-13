import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";
import { ManageProducts } from "../../components/admin/ManageProducts";
import { ManageCategories } from "../../components/admin/ManageCategories";
import { ManageOrders } from "../../components/admin/ManageOrders";
import { ManageUsers } from "../../components/admin/ManageUsers";
import { ManageNewsletter } from "../../components/admin/ManageNewsletter";

// Dashboard Analytics Component 
const DashboardOverview = () => {
  // In a real implementation, these would come from API calls
  const [stats, setStats] = useState([
    { label: "Produits", value: "24", icon: "✦" },
    { label: "Commandes en attente", value: "8", icon: "✧" },
    { label: "Nouveaux clients", value: "12", icon: "✦" },
    { label: "Revenu mensuel", value: "14 500 MAD", icon: "✧" }
  ]);
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/30 backdrop-blur-sm border border-brandGold/20 rounded-xl p-8 shadow-luxury">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-serif text-brandGold">Bienvenue chez Maison Diamant Rouge</h2>
            <p className="text-platinumGray mt-3 max-w-2xl">
              Gérez votre collection de bijoux d'exception, suivez vos commandes et orchestrez l'expérience Diamant Rouge.
            </p>
          </div>
          <div className="hidden md:block relative w-28 h-28">
            <Image 
              src="/logo1.jpeg" 
              alt="Diamant Rouge" 
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white/30 backdrop-blur-sm border border-brandGold/20 rounded-xl p-6 shadow-luxury"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-platinumGray font-medium text-sm">{stat.label}</p>
                <p className="text-3xl font-serif text-brandGold mt-2">{stat.value}</p>
              </div>
              <span className="text-2xl text-brandGold">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/30 backdrop-blur-sm border border-brandGold/20 rounded-xl p-6 shadow-luxury">
          <h3 className="text-xl font-serif text-brandGold mb-4 border-b border-brandGold/20 pb-3">
            Activités Récentes
          </h3>
          <div className="space-y-4">
            {[
              { action: "Nouvelle commande", item: "Bague Soleil Diamant", time: "Il y a 2 heures", status: "En attente" },
              { action: "Produit ajouté", item: "Collier Étoile Filante", time: "Il y a 5 heures", status: "Publié" },
              { action: "Stock mis à jour", item: "Bracelet Lumière d'Or", time: "Il y a 1 jour", status: "En stock" },
              { action: "Nouveau client", item: "Marie Dupont", time: "Il y a 2 jours", status: "" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-brandGold/10 last:border-0">
                <div>
                  <p className="text-richEbony font-medium">{activity.action}</p>
                  <p className="text-platinumGray text-sm">{activity.item}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 bg-brandGold/10 text-brandGold rounded-full">
                    {activity.status}
                  </span>
                  <p className="text-platinumGray text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="bg-white/30 backdrop-blur-sm border border-brandGold/20 rounded-xl p-6 shadow-luxury">
          <h3 className="text-xl font-serif text-brandGold mb-4 border-b border-brandGold/20 pb-3">
            Actions Rapides
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => {}} 
              className="w-full py-3 px-4 bg-transparent border border-brandGold text-brandGold rounded-lg hover:bg-brandGold hover:text-richEbony transition duration-300 text-left"
            >
              ✦ Ajouter un Nouveau Produit
            </button>
            <button 
              onClick={() => {}} 
              className="w-full py-3 px-4 bg-transparent border border-brandGold text-brandGold rounded-lg hover:bg-brandGold hover:text-richEbony transition duration-300 text-left"
            >
              ✦ Voir les Commandes en Attente
            </button>
            <button 
              onClick={() => {}} 
              className="w-full py-3 px-4 bg-transparent border border-brandGold text-brandGold rounded-lg hover:bg-brandGold hover:text-richEbony transition duration-300 text-left"
            >
              ✦ Gérer les Produits en Vedette
            </button>
            <button 
              onClick={() => {}} 
              className="w-full py-3 px-4 bg-transparent border border-brandGold text-brandGold rounded-lg hover:bg-brandGold hover:text-richEbony transition duration-300 text-left"
            >
              ✦ Mettre à Jour la Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders" | "users" | "newsletter">("overview");

  return (
    <AdminLayout title="Dashboard Admin">
        {/* Navigation Tabs */}
        <nav className="mb-8 pb-4 border-b border-brandGold/20">
          <div className="flex flex-nowrap overflow-x-auto space-x-4 pb-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${activeTab === "overview" ? 
                  "bg-brandGold text-richEbony shadow-luxury" : 
                  "bg-transparent border border-brandGold/50 text-brandGold hover:bg-brandGold/10"}`}
            >
              Vue d'Ensemble
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${activeTab === "products" ? 
                  "bg-brandGold text-richEbony shadow-luxury" : 
                  "bg-transparent border border-brandGold/50 text-brandGold hover:bg-brandGold/10"}`}
            >
              Produits
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${activeTab === "categories" ? 
                  "bg-brandGold text-richEbony shadow-luxury" : 
                  "bg-transparent border border-brandGold/50 text-brandGold hover:bg-brandGold/10"}`}
            >
              Catégories
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${activeTab === "orders" ? 
                  "bg-brandGold text-richEbony shadow-luxury" : 
                  "bg-transparent border border-brandGold/50 text-brandGold hover:bg-brandGold/10"}`}
            >
              Commandes
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${activeTab === "users" ? 
                  "bg-brandGold text-richEbony shadow-luxury" : 
                  "bg-transparent border border-brandGold/50 text-brandGold hover:bg-brandGold/10"}`}
            >
            Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab("newsletter")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
                ${activeTab === "newsletter" ? 
                  "bg-brandGold text-richEbony shadow-luxury" : 
                  "bg-transparent border border-brandGold/50 text-brandGold hover:bg-brandGold/10"}`}
            >
              Newsletter
            </button>
          </div>
        </nav>

      {/* Tab Content */}
      <div>
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "products" && <ManageProducts />}
          {activeTab === "categories" && <ManageCategories />}
          {activeTab === "orders" && <ManageOrders />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "newsletter" && <ManageNewsletter />}
    </div>
    </AdminLayout>
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