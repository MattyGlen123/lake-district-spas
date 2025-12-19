'use client';

import { useState, useRef, useEffect } from 'react';
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

interface SpaCardProps {
  spa: Spa;
  isExpanded: boolean;
  onToggle: () => void;
}

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

  return (
    <article ref={cardRef} className="spa-card">
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
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Image placeholder
        </div>
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

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-border animate-slide-down">
            {/* Thermal Facilities */}
            <div>
              <h4 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
                <Thermometer className="w-5 h-5 text-primary" />
                Thermal Suite Facilities
              </h4>
              <div className="space-y-2">
                {spa.thermalFacilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground">{facility.name}</span>
                    <span className="text-muted-foreground">
                      ({facility.details})
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
                    <span className="font-medium text-foreground">
                      {pool.name}:
                    </span>{' '}
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
        )}

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
    </article>
  );
};

export default SpaCard;
