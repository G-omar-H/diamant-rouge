// pages/admin/products/index.tsx

import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

type AdminProduct = {
    id: number;
    sku: string;
    basePrice: string;
    translations: {
        language: string;
        name: string;
    }[];
};

type ProductsAdminProps = {
    products: AdminProduct[];
};

export default function ProductsAdminPage({ products }: ProductsAdminProps) {
    return (
        <section className="section-light min-h-screen p-8">
            <h1 className="text-3xl font-serif text-brandGold mb-6">
                Gérer les Produits
            </h1>

            <a
                href="/admin/products/create"
                className="button-primary inline-block mb-6"
            >
                + Ajouter un Nouveau Produit
            </a>

            <table className="w-full bg-burgundy/10 text-richEbony shadow-luxury rounded-lg overflow-hidden">
                <thead className="bg-burgundy/20">
                <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">SKU</th>
                    <th className="p-3 text-left">Nom (FR)</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">En Vedette</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((prod) => {
                    const frTranslation = prod.translations.find(
                        (t) => t.language === "fr"
                    ) || prod.translations[0];
                    return (
                        <tr
                            key={prod.id}
                            className="border-b border-platinumGray/30 hover:bg-burgundy/10"
                        >
                            <td className="p-3">{prod.id}</td>
                            <td className="p-3">{prod.sku}</td>
                            <td className="p-3">{frTranslation?.name}</td>
                            <td className="p-3">{parseFloat(prod.basePrice).toLocaleString('fr-FR')} MAD</td>
                            <td className="p-3 text-center">
                                {prod.featured ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brandGold text-richEbony">
                                        Oui
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Non
                                    </span>
                                )}
                            </td>
                            <td className="p-3 text-center">
                                <a
                                    href={`/admin/products/${prod.id}/edit`}
                                    className="text-burgundy hover:text-brandGold mr-3"
                                >
                                    Modifier
                                </a>
                                <a
                                    href={`/admin/products/${prod.id}/delete`}
                                    className="text-burgundy hover:text-brandGold"
                                >
                                    Supprimer
                                </a>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
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

    const rawProducts = await prisma.product.findMany({
        include: {
            translations: true,
        },
        orderBy: { id: "asc" },
    });

    // Convert Date objects to strings
    const products = JSON.parse(JSON.stringify(rawProducts));

    return {
        props: {
            products,
        },
    };
};
