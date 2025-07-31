export interface EnvironmentConfig {
  name: string;
  url: string;
  workspace: string;
  description: string;
}

export const environments: EnvironmentConfig[] = [
  {
    name: 'prod',
    url: 'https://admin.hipporello.com/',
    workspace: 'TESTMANDESKASANAPR12a',
    description: 'Production Environment'
  },
  {
    name: 'staging',
    url: 'https://admin.hipporellostaging.com/tickets',
    workspace: 'TESTMANDESKASANAPR12a',
    description: 'Staging Environment'
  },
  {
    name: 'qa',
    url: 'https://qaadmin.hipporello.io/',
    workspace: 'TESTMANDESKASANAPR12a',
    description: 'QA Environment'
  }
];

export function getEnvironment(envName: string): EnvironmentConfig {
  const env = environments.find(e => e.name === envName);
  if (!env) {
    throw new Error(`Environment '${envName}' not found. Available environments: ${environments.map(e => e.name).join(', ')}`);
  }
  return env;
}

export function getAllEnvironments(): EnvironmentConfig[] {
  return environments;
} 