import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/lake-district-spas_hero.jpg"
          alt="Luxury Lake District spa hotel nestled on tranquil lakeside at dawn with dramatic mountain fells rising through morning mist, warm golden lighting reflecting on still waters, showcasing the stunning natural setting of Lake District spa retreats and wellness destinations in Cumbria"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 to-foreground/70" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-xl font-serif text-primary-foreground mb-4">
            Lake District Spas
          </h1>
          <p
            className="text-lg md:text-xl text-primary-foreground/90 font-medium mb-3"
            style={{ animationDelay: '0.1s' }}
          >
            Find the perfect spa for you
          </p>
          <p
            className="text-sm md:text-base text-primary-foreground/80"
            style={{ animationDelay: '0.2s' }}
          >
            Compare spas facilities and access policies
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
