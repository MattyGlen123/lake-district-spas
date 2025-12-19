const Hero = () => {
  return (
    <section className="relative h-[300px] md:h-[400px] mt-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 to-foreground/70" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
            Lake District Spas 2025: Complete Guide
          </h1>
          <p
            className="text-lg md:text-xl text-primary-foreground/90 font-medium mb-3 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            Know Before You Book - Is The Spa Included With Your Room?
          </p>
          <p
            className="text-sm md:text-base text-primary-foreground/80 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Compare 22 spa hotels with detailed facility information and access
            policies
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
