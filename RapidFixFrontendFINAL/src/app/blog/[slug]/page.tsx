import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${title} | RapidFix Blog`,
    description: `Read our latest article on ${title} and learn expert automotive tips.`,
    alternates: { canonical: `https://rapidfixauto.in/blog/${params.slug}` },
  };
}

export default function BlogPostPage({ params }: Props) {
  const title = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <main className="p-8 max-w-3xl mx-auto min-h-screen pt-24">
      <Link href="/blog" className="text-sm font-bold uppercase hover:underline mb-6 inline-block">← Back to Blog</Link>
      
      <h1 className="text-4xl font-black uppercase mb-6">{title}</h1>
      
      <div className="prose max-w-none mb-12">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Welcome to our detailed guide on {title}. Maintaining your vehicle is crucial for safety, performance, and longevity. In this article, we dive deep into the best practices and expert recommendations tailored specifically for Indian roads and conditions.
        </p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">Expert Insights & Recommendations</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Whether you own a car or a two-wheeler, staying proactive about maintenance saves you money in the long run. By following manufacturer guidelines and scheduling regular check-ups, you can avoid unexpected breakdowns and ensure a smooth riding experience. 
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-8">Conclusion</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          We hope this guide provides you with valuable insights. Remember, regular servicing is the key to a healthy vehicle. If you notice any unusual sounds or performance drops, do not hesitate to consult a professional mechanic.
        </p>
      </div>

      <div className="bg-black text-white p-10 rounded-xl text-center">
        <h2 className="text-2xl font-black mb-4 uppercase">Need Professional Assistance?</h2>
        <p className="mb-6 text-gray-300">Our certified mechanics are just a click away.</p>
        <Link href="/booking">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-bold uppercase">Book a Service</Button>
        </Link>
      </div>
    </main>
  );
}
