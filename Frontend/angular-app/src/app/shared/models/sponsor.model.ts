export interface Sponsor {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Contract {
  id?: number;
  contractNumber: string;
  startDate: string;
  endDate: string;
  amount?: number;
  currency?: string;
  description?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  type?: 'COURSE' | 'EVENT' | 'CERTIFICATION' | 'GLOBAL';
  sponsor?: Sponsor;
}

export interface Sponsorship {
  id?: number;
  sponsorshipType?: 'COURSE' | 'EVENT' | 'CERTIFICATION' | 'OFFER';
  amountAllocated?: number;
  startDate?: string;
  endDate?: string;
  visibilityLevel?: 'LOGO' | 'FEATURED' | 'TITLE';
  targetType?: 'COURSE' | 'EVENT' | 'CERTIFICATION' | 'OFFER';
  targetId?: number;
  contract?: Contract;
}

export interface SponsorDashboard {
  sponsor: Sponsor;
  contracts: Contract[];
  sponsorships: Sponsorship[];
  totalContractAmount: number;
  totalSpent: number;
  remainingBalance: number;
}

