import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Proof } from '@/components/landing/Proof';
import { WhatYouGet } from '@/components/landing/WhatYouGet';
import { Problem } from '@/components/landing/Problem';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Capabilities } from '@/components/landing/Capabilities';
import { ForIndividuals } from '@/components/landing/ForIndividuals';
import { ForOrganisations } from '@/components/landing/ForOrganisations';
import { Comparison } from '@/components/landing/Comparison';
import { FieldToTech } from '@/components/landing/FieldToTech';
import { Team } from '@/components/landing/Team';
import { FinalCta } from '@/components/landing/FinalCta';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Proof />
        <WhatYouGet />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <ForIndividuals />
        <ForOrganisations />
        <Comparison />
        <FieldToTech />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
