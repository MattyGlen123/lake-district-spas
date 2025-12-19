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
              Your complete guide to spa hotels in the Lake District. Compare
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
                  href="#about"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Contact
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
              className="text-sm text-primary hover:underline"
            >
              hello@lakedistrictspas.com
            </a>
          </div>
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
