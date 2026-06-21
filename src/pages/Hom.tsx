import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#171717]">
 

      <section className="relative flex min-h-screen items-center px-6 pt-24 overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2 min-h-screen">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
              New Luxury Collection
            </p>

            <h2 className="mb-6 text-5xl font-semibold leading-tight md:text-7xl">
              Elevate Your Everyday Style
            </h2>

            <p className="mb-8 max-w-md text-lg leading-8 text-neutral-600">
              Discover premium fashion pieces designed for elegance, comfort,
              and timeless confidence.
            </p>

            <Link to="/products" className="rounded-full bg-black px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800">
              Shop Now
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-200 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
                alt="Luxury fashion"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-white p-6 shadow-xl">
              <p className="text-sm text-neutral-500">Starting from</p>
              <p className="text-2xl font-bold">$89.00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
