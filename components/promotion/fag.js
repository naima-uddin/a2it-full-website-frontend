"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

const faqData = [
  {
    question: "What is a web hosting service?",
    answer:
      "A web hosting service allows individuals and organizations to make their website accessible via the Internet. It stores your website's files on servers and ensures availability 24/7.",
  },
  {
    question: "How can a responsive website improve my business?",
    answer:
      "Responsive websites adapt to any device, offering better user experience. This increases engagement, reduces bounce rates, and improves search engine rankings.",
  },
  {
    question: "What is the best way to secure my website?",
    answer:
      "Using HTTPS, strong passwords, regular updates, and security plugins helps protect your website from cyber threats and data breaches.",
  },
  {
    question: "How do I track my website traffic?",
    answer:
      "Integrating analytics tools like Google Analytics or Matomo allows you to monitor user behavior, page views, and conversion metrics for your website.",
  },
];

const counterData = [
  { label: "Projects Delivered", value: 120 },
  { label: "Happy Clients", value: 85 },
  { label: "Websites Optimized", value: 45 },
  { label: "Cups of Coffee", value: 999 },
];

function Counter({ value }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500; // ms
    const increment = value / (duration / 30);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(counter);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-36">
      <span className="text-3xl font-bold text-teal-500">{count}</span>
      <span className="text-gray-700 mt-1 text-center">{counterData.find(c => c.value === value).label}</span>
    </div>
  );
}

export default function Fag() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative py-16 px-6 md:px-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f5b342] via-white to-gray-500 animate-gradient-x"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Left FAQ */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-2">
            Our Expert <span className="text-teal-500">Answers</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            All FAQs here are tailored for web development and online businesses. Learn how to optimize your website and digital presence effectively.
          </p>

          <div className="space-y-3">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? "border-teal-500 shadow-lg bg-teal-50"
                    : "border-gray-300 bg-white"
                }`}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? -1 : index)
                }
              >
                <div className="flex justify-between items-center">
                  <h3
                    className={`text-sm md:text-base font-semibold ${
                      activeIndex === index ? "text-teal-600" : "text-gray-800"
                    }`}
                  >
                    {item.question}
                  </h3>
                  <span className="text-teal-500 font-bold">
                    {activeIndex === index ? "-" : "+"}
                  </span>
                </div>
                {activeIndex === index && (
                  <p className="mt-2 text-gray-700 text-sm">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Counters */}
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          {counterData.map((item, idx) => (
            <Counter key={idx} value={item.value} />
          ))}
        </div>
      </div>

      {/* Tailwind gradient animation */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </section>
  );
}
