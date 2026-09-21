import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Solution } from '@/components/landing/Solution';
import { Capabilities } from '@/components/landing/Capabilities';
import { AhaMoment } from '@/components/landing/AhaMoment';
import { InsightToAction } from '@/components/landing/InsightToAction';
import { ForIndividuals } from '@/components/landing/ForIndividuals';
import { ForOrganisations } from '@/components/landing/ForOrganisations';
import { Comparison } from '@/components/landing/Comparison';
import { TrackRecord } from '@/components/landing/TrackRecord';
import { FieldToTech } from '@/components/landing/FieldToTech';
import { Trust } from '@/components/landing/Trust';
import { Team } from '@/components/landing/Team';
import { FinalCta } from '@/components/landing/FinalCta';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Capabilities />
        <AhaMoment />
        <InsightToAction />
        <ForIndividuals />
        <ForOrganisations />
        <Comparison />
        <TrackRecord />
        <FieldToTech />
        <Trust />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
