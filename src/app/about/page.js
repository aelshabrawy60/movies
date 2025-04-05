"use client"

import React from 'react';
import MenuButton from '@/components/MenuButton';
import AboutHero from '@/components/AboutHero';
import CompanyOverview from '@/components/CompanyOverview';
import ServicesGrid from '@/components/ServicesGrid';
import Achievements from '@/components/Achievements';
import TeamSection from '@/components/TeamSection';
import ContactCTA from '@/components/ContactCTA';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-5 left-5 w-full h-full z-50">
        <MenuButton />
      </div>
      
      <div className="relative">
        <AboutHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
          <CompanyOverview />
          <ServicesGrid />
          <Achievements />
          <TeamSection />
          <ContactCTA />
        </div>
      </div>
    </div>
  );
}
