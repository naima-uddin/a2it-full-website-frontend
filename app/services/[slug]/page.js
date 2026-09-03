import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { ServiceIcon } from "@/lib/serviceIcons";
import { fetchServiceByPath } from "@/lib/api/services";

// Newly added services (created from the dashboard) render through this
// template. Existing hand-designed routes like /services/amazon take
// precedence over this dynamic segment, so their custom pages are untouched.

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await fetchServiceByPath(`/services/${slug}`);

  if (!service) {
    return { title: "Service | A2IT Ltd" };
  }

  return {
    title: `${service.title} | A2IT Ltd`,
    description: service.description,
    alternates: { canonical: `https://a2itltd.com/services/${slug}` },
    openGraph: {
      title: `${service.title} | A2IT Ltd`,
      description: service.description,
      url: `https://a2itltd.com/services/${slug}`,
      siteName: "A2IT Ltd",
      type: "website",
      ...(service.image ? { images: [{ url: service.image }] } : {}),
    },
  };
}

export default async function DynamicServicePage({ params }) {
  const { slug } = await params;
  const service = await fetchServiceByPath(`/services/${slug}`);

  if (!service) {
    notFound();
  }

  const features = Array.isArray(service.features) ? service.features : [];

  return (
    <main className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a12] via-[#0d1b3d] to-[#0066ff]">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(60%_60%_at_50%_0%,#00f0ff_0%,transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-2 text-sm text-[#8fd7ff] mb-6">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">
              Services
            </Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white text-3xl mb-6 shadow-lg shadow-cyan-500/30">
            <ServiceIcon name={service.icon} />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl">
            {service.title}
          </h1>
          <p className="mt-5 text-lg text-[#c9dbff] max-w-2xl">
            {service.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold hover:opacity-90 transition"
            >
              Get Started <FaArrowRight />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
            >
              All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <p className="text-[#0066ff] font-semibold italic mb-2">
            What you get
          </p>
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>

          {features.length > 0 ? (
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-[#0066ff] flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">
              Contact us to learn more about this service.
            </p>
          )}
        </div>

        <div className="relative">
          {service.image ? (
            <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-[320px] md:h-[420px] rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#dbe7ff] flex items-center justify-center">
              <div className="text-[#0066ff] text-[120px]">
                <ServiceIcon name={service.icon} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your project?
          </h2>
          <p className="text-slate-600 mb-8">
            Let&apos;s talk about how {service.title} can help your business grow.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0066ff] to-[#00f0ff] text-white font-semibold hover:opacity-90 transition"
          >
            Contact Us <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
