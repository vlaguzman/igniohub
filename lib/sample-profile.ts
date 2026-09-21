// Illustrative sample data used to render an example capability profile in
// the landing page (Hero score card + "aha moment" section). These are NOT
// real assessment results — every place that renders them must pair the
// numbers with an "illustrative example" label (see landing.hero.sampleCard.note
// and landing.ahaMoment.disclaimer in messages/*.json).

export const CAPABILITY_KEYS = [
  'selfEfficacy',
  'resilience',
  'opportunityMindset',
  'collaborativeTrust',
  'entrepreneurialAgency',
  'strategicAdaptability',
  'leadershipInitiative',
  'economicIntegrationReadiness',
] as const;

export type CapabilityKey = (typeof CAPABILITY_KEYS)[number];

export const SAMPLE_SCORES: Record<CapabilityKey, number> = {
  selfEfficacy: 78,
  resilience: 65,
  opportunityMindset: 82,
  collaborativeTrust: 71,
  entrepreneurialAgency: 88,
  strategicAdaptability: 74,
  leadershipInitiative: 60,
  economicIntegrationReadiness: 69,
};

export const STRONGEST_CAPABILITY: CapabilityKey = 'entrepreneurialAgency';
export const DEVELOPMENT_OPPORTUNITY: CapabilityKey = 'leadershipInitiative';
