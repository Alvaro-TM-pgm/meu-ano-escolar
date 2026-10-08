export const defaultSettings={annualTarget:24,minimumAverage:6,termCount:4,calcMode:'simple',theme:'light',tutorialSeen:false};
export function mergeSettings(value={}){return {...defaultSettings,...value}}
