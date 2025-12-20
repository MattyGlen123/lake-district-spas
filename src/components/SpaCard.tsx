'use client';

import { useRef, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Thermometer,
  Waves,
  Shield,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { Spa, businessModelConfig, BusinessModel } from '@/types/spa';

// Import spa images (add more as they become available)
// For now, we'll use a fallback approach that works with public folder images
// or shows a placeholder if images aren't available

interface SpaCardProps {
  spa: Spa;
  isExpanded: boolean;
  onToggle: () => void;
}

// Image map for imported assets (add entries as images are added to assets folder)
const imageMap: Record<string, string> = {
  // Add imported images here when available
  // Example:
  // '/spa-armathwaite-hall-hotel-spa.jpg': spaArmathwaite,
};

const SpaCard = ({ spa, isExpanded, onToggle }: SpaCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const config = businessModelConfig[spa.businessModel];

  const getBadgeClass = (model: BusinessModel) => {
    const classes: Record<BusinessModel, string> = {
      'free-with-booking': 'badge-green',
      'paid-extra': 'badge-yellow',
      'day-passes': 'badge-blue',
      'guests-only': 'badge-red',
      hybrid: 'badge-purple',
    };
    return classes[model];
  };

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      const yOffset = -80;
      const y =
        cardRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isExpanded]);

  // Use mapped image if available, otherwise fall back to public folder path
  // If image doesn't exist, browser will show broken image (we can add error handling later)
  const imageUrl = imageMap[spa.imageUrl] || spa.imageUrl;

  // Handle image loading errors with a placeholder
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    // Fallback to a placeholder gradient if image fails to load
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.className =
        'w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center';
      parent.innerHTML =
        '<span class="text-muted-foreground text-sm">Image coming soon</span>';
    }
  };

  return (
    <article ref={cardRef} className="spa-card overflow-hidden">
      {/* Mobile Layout (stacked) */}
      <div className="lg:hidden">
        {/* Business Model Badge */}
        <div
          className={`h-10 flex items-center justify-center font-bold text-sm ${getBadgeClass(
            spa.businessModel
          )}`}
        >
          <span>
            {config.dot} {config.badgeText}
          </span>
        </div>

        {/* Image */}
        <div className="aspect-video overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={`${spa.name} thermal suite and pool`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Spa Name */}
          <h3 className="text-xl font-semibold text-foreground mb-1">
            <a
              href={spa.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              {spa.name}
              <ExternalLink className="w-4 h-4" />
            </a>
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            {spa.location}
          </p>

          {/* Key Features */}
          <ul className="space-y-2 mb-4">
            {spa.keyFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
              >
                <Check className="w-4 h-4 text-spa-green shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Expand/Collapse Button */}
          <button
            onClick={onToggle}
            className="card-expand-btn mt-4 flex items-center justify-center gap-2"
            aria-expanded={isExpanded}
            aria-label={
              isExpanded
                ? `Collapse details for ${spa.name}`
                : `View full details for ${spa.name}`
            }
          >
            {isExpanded ? (
              <>
                Collapse Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                View Full Details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Layout (horizontal) */}
      <div className="hidden lg:block">
        {/* Business Model Badge - Full Width */}
        <div
          className={`h-10 flex items-center justify-center font-bold text-sm ${getBadgeClass(
            spa.businessModel
          )}`}
        >
          <span>
            {config.dot} {config.badgeText}
          </span>
        </div>

        <div className="flex">
          {/* Image - Left Side */}
          <div className="w-80 xl:w-96 shrink-0 bg-gray-200">
            <img
              src={imageUrl}
              alt={`${spa.name} thermal suite and pool`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          </div>

          {/* Content - Right Side */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1">
              {/* Spa Name */}
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                <a
                  href={spa.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                >
                  {spa.name}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </h3>

              {/* Location */}
              <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                {spa.location}
              </p>

              {/* Key Features - Horizontal on Desktop */}
              <ul className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                {spa.keyFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
                  >
                    <Check className="w-4 h-4 text-spa-green shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={onToggle}
              className="card-expand-btn mt-4 flex items-center justify-center gap-2 self-start"
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? `Collapse details for ${spa.name}`
                  : `View full details for ${spa.name}`
              }
            >
              {isExpanded ? (
                <>
                  Collapse Details <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  View Full Details <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content - Full Width (shared for both layouts) */}
      {isExpanded && (
        <div className="p-6 pt-0 lg:pt-6 lg:border-t border-border animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thermal Facilities */}
            <div>
              <h4 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                <Thermometer className="w-5 h-5 text-primary" />
                Thermal Suite Facilities
              </h4>
              <div className="space-y-2">
                {spa.thermalFacilities.map((facility, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-foreground block">
                      {facility.name}
                    </span>
                    <span className="text-muted-foreground">
                      {facility.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pool Features */}
            <div>
              <h4 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                <Waves className="w-5 h-5 text-primary" />
                Pools & Water Features
              </h4>
              <div className="space-y-2">
                {spa.poolFeatures.map((pool, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-foreground block">
                      {pool.name}:
                    </span>
                    <span className="text-muted-foreground">
                      {pool.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Policy */}
            <div>
              <h4 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                <Shield className="w-5 h-5 text-primary" />
                Access Policy & Booking
              </h4>
              <ul className="space-y-2">
                {spa.accessPolicy.map((policy, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="text-muted-foreground">•</span>
                    {policy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Good to Know */}
            <div>
              <h4 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                Good to Know
              </h4>
              <ul className="space-y-2">
                {spa.goodToKnow.map((info, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="text-muted-foreground">•</span>
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default SpaCard;
