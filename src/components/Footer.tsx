const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary-foreground mb-4">
              Lake District Spas
            </h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Your complete guide to spas in the Lake District. Compare
              facilities, access policies, and find your perfect wellness
              retreat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/partnership"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Partnership
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90 mb-4">
              Contact
            </h4>
            <p className="text-sm text-primary-foreground/70">
              Have a question or suggestion?
            </p>
            <a
              href="mailto:hello@lakedistrictspas.com"
              className="text-sm text-white hover:underline"
            >
              contact@lakedistrictspas.co.uk
            </a>
          </div>
        </div>

        {/* Image Notice */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <p className="text-sm text-primary-foreground/70 text-center md:text-left leading-relaxed">
            <span className="font-medium">Image Notice:</span> Photos are
            sourced from spa websites for informational purposes to help
            visitors make informed decisions. Spa owners: if you&apos;d prefer
            we use different images please contact us at{' '}
            <a
              href="mailto:contact@lakedistrictspas.co.uk"
              className="text-primary-foreground hover:text-primary-foreground/90 underline underline-offset-2 font-medium"
              aria-label="Email contact@lakedistrictspas.co.uk"
            >
              contact@lakedistrictspas.co.uk
            </a>
            .
          </p>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Lake District Spas. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
