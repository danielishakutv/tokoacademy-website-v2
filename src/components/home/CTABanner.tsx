import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="section-padding bg-gradient-to-r from-toko-green to-toko-blue">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-white mb-6">
            Start Your Tech Journey Today
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/95">
            Join 2,000+ learners who have transformed their careers with Toko Academy. 
            Take the first step towards mastering in-demand digital skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register/"
              className="inline-block px-10 py-5 bg-white text-toko-green font-bold text-lg 
                       rounded hover:bg-toko-gray-100 transition-all duration-300 
                       focus:outline-none focus:ring-4 focus:ring-white/50
                       shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Apply Now
            </Link>
            <a
              href={`https://wa.me/2348088256055?text=Hello%20Toko%20Academy,%20I'd%20like%20to%20learn%20more%20about%20your%20courses`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-transparent text-white font-bold text-lg 
                       border-2 border-white rounded hover:bg-white hover:text-toko-green 
                       transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50
                       transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <p className="mt-8 text-white/80">
            Questions? Call us: <a href="tel:+2348088256055" className="font-semibold hover:underline">+234 808 825 6055</a>
          </p>
        </div>
      </div>
    </section>
  );
}
