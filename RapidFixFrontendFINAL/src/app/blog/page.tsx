import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Automotive Blog | Car & Bike Maintenance Tips | RapidFix",
  description: "Read the latest tips, tricks, and expert advice on car and bike maintenance, repairs, and auto news from RapidFix.",
  keywords: ["automotive blog", "car maintenance tips", "bike repair advice", "RapidFix blog"],
  alternates: { canonical: "https://rapidfixauto.in/blog" },
};

export default function BlogHubPage() {
  const posts = [
    { slug: "5-tips-for-better-car-mileage", title: "5 Tips for Better Car Mileage", excerpt: "Learn how to optimize your car's fuel efficiency with these simple maintenance tips." },
    { slug: "when-to-change-bike-engine-oil", title: "When to Change Your Bike's Engine Oil?", excerpt: "Discover the best intervals and signs that indicate your two-wheeler needs an oil change." },
    { slug: "importance-of-wheel-alignment", title: "The Importance of Regular Wheel Alignment", excerpt: "Find out why keeping your wheels aligned is crucial for safety and tyre longevity." }
  ];

  return (
    <main className="p-8 max-w-5xl mx-auto min-h-screen pt-24">
      <h1 className="text-4xl font-black uppercase mb-6">RapidFix Blog</h1>
      <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Stay updated with the latest automotive news, maintenance tips, and expert advice from our certified mechanics. We share valuable insights to help you keep your vehicle running smoothly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block border-2 border-black rounded-xl p-6 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow">
            <h2 className="text-xl font-bold mb-3">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <span className="inline-block mt-4 text-sm font-bold uppercase underline">Read More</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
