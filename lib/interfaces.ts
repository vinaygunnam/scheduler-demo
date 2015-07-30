export interface Template {
    start: number;
    end?: number;
    resources: Resource[];
}

export interface Resource {
    sequence: number;
    duration: number; // minutes
    role: ResourceType
}

export enum ResourceType {
  technician,
  advisor,
  valet,
  manager
}

export interface WindowInfo {
  start: number; // UNIX timestamp
  end: number; // UNIX timestamp
  startText: string;
  endText: string;
  roles: string[];
  guid: string;
}

export interface ResourceWindow {
    start: number; // UNIX timestamp
    end: number; // UNIX timestamp
    startText: string;
    endText: string;
    roles: ResourceType[];
    id: string;
    roundId?: number;
    blocked?: boolean;
}

export interface Buckets {
    technicians: ResourceWindow[];
    advisors: ResourceWindow[];
    valets: ResourceWindow[];
    managers: ResourceWindow[];
}

export interface ResourceComboResult {
    resources: ResourceWindow[];
    requirementsMet: boolean;
}

export interface ResourceResult {
    resource: ResourceWindow;
    endOfWork: number;
}

export interface ResourceValidationResult {
    isValid: boolean;
    endOfWork: number;
}
