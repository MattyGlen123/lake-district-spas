'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
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
import { Spa, accessLabelConfig, AccessLabel } from '@/types/spa';

interface SpaCardProps {
  spa: Spa;
  isExpanded: boolean;
  onToggle: () => void;
}

const SpaCard = ({ spa, isExpanded, onToggle }: SpaCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  // Sort access labels: hotel badges first, then public (day passes)
  const sortedAccessLabels = [...spa.accessLabels].sort((a, b) => {
    const aCategory = accessLabelConfig[a].category;
    const bCategory = accessLabelConfig[b].category;
    if (aCategory === 'hotel' && bCategory === 'public') return -1;
    if (aCategory === 'public' && bCategory === 'hotel') return 1;
    return 0;
  });

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      const yOffset = -80;
      const y =
        cardRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isExpanded]);

  return (
    <article ref={cardRef} className="spa-card overflow-hidden">
      {/* Mobile Layout (stacked) */}
      <div className="lg:hidden">
        {/* Image - Mobile: 389px × 250px (1.556:1 ratio) */}
        <div className="aspect-[389/250] overflow-hidden bg-gray-200 relative">
          {/* Access Label Badges - Top Left */}
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
            {sortedAccessLabels.map((label) => {
              const config = accessLabelConfig[label];
              return (
                <div
                  key={label}
                  className="bg-white text-black px-2 py-1 rounded-lg text-sm inline-flex items-center gap-1"
                >
                  <span>{config.dot}</span>
                  <span>{config.shortLabel}</span>
                </div>
              );
            })}
          </div>
          {!imageError ? (
            <Image
              src={spa.imageSrc}
              alt={spa.imageAlt}
              fill
              className="object-cover"
              loading="lazy"
              quality={85}
              sizes="100vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Image not available</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Spa Name */}
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {spa.name}
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

          {/* Expanded Content - Mobile */}
          {isExpanded && (
            <div className="pt-4 border-t border-border animate-slide-down mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>
          )}

          {/* View Website Button */}
          <a
            href={spa.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 rounded-lg px-4 py-3 text-sm font-medium transition-colors mt-4 flex items-center justify-center gap-2"
          >
            View Website <ExternalLink className="w-4 h-4" />
          </a>

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
        <div className="flex items-stretch">
          {/* Image - Left Side: 600px × 400px (1.5:1 ratio) */}
          <div className="w-[600px] min-h-[400px] shrink-0 bg-gray-200 relative overflow-hidden">
            {/* Access Label Badges - Top Left */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1">
              {sortedAccessLabels.map((label) => {
                const config = accessLabelConfig[label];
                return (
                  <div
                    key={label}
                    className="bg-white text-black px-2 py-1 rounded-lg text-sm inline-flex items-center gap-1"
                  >
                    <span>{config.dot}</span>
                    <span>{config.shortLabel}</span>
                  </div>
                );
              })}
            </div>
            {!imageError ? (
              <Image
                src={spa.imageSrc}
                alt={spa.imageAlt}
                fill
                className="object-cover"
                loading="lazy"
                quality={85}
                sizes="600px"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-sm">Image not available</span>
              </div>
            )}
          </div>

          {/* Content - Right Side */}
          <div className="flex-1 p-6 flex flex-col min-h-[400px]">
            <div className="flex-1">
              {/* Spa Name */}
              <h3 className="text-2xl font-semibold text-foreground mb-1">
                {spa.name}
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

            {/* View Website Button */}
            <a
              href={spa.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 rounded-lg px-4 py-3 text-sm font-medium transition-colors mt-4 flex items-center justify-center gap-2 self-start"
            >
              View Website <ExternalLink className="w-4 h-4" />
            </a>

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

      {/* Expanded Content - Desktop */}
      {isExpanded && (
        <div className="hidden lg:block p-6 pt-6 border-t border-border animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      )}
    </article>
  );
};

export default SpaCard;
