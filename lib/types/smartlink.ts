export interface SmartlinkEvent {
  id: string;
  releaseId?: string;
  platform?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  countryCode?: string;
  deviceType?: string;
  createdAt: string;
}
