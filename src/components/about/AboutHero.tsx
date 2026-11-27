import Image from "next/image";

const HERO_PHOTOS = [
  {
    src: "/images/ig-post/6.jpg",
    alt: "BGC Coffee Co. crafted coffee moment 1",
  },
  {
    src: "/images/ig-post/7.jpg",
    alt: "BGC Coffee Co. crafted coffee moment 2",
  },
  {
    src: "/images/ig-post/8.jpg",
    alt: "BGC Coffee Co. crafted coffee moment 3",
  },
];

export function AboutHero() {
  return (
    <section className="bg-[#F7F4EE] text-[#171717] pt-14 pb-16 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Centered Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 border border-[#171717] bg-white px-4 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-[#795548] vintage-shadow-sm">
            OUR STORY · BGC COFFEE CO.
          </span>

          <h1 className="mt-6 font-editorial text-5xl leading-[1.02] tracking-tight text-[#171717] sm:text-6xl lg:text-7xl">
            Not Just Another{" "}
            <span className="italic text-[#795548]">Cup of Coffee.</span>
          </h1>
        </div>

        {/* 3-Photo Vintage Triptych */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {HERO_PHOTOS.map((photo, index) => (
            <div
              key={photo.src}
              className="border border-[#171717] bg-white p-2.5 vintage-shadow-sm"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#171717] bg-[#3B2923]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center contrast-[1.03]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
