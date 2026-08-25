export type RequestStatus =
  | "REQUESTED"
  | "REVIEW"
  | "QUOTE"
  | "ACCEPTED"
  | "PAID"
  | "LYRICS"
  | "PRODUCTION"
  | "REVIEW_VERSION"
  | "REVISION"
  | "MASTERING"
  | "DELIVERED"
  | "CANCELED";

export interface ProjectRequest {
  id: string;
  status: RequestStatus;
  songType: string;
  genres: string[];
  vocals?: string;
  language?: string;
  story?: string;
  namesInclude?: string;
  namesExclude?: string;
  references?: string;
  deadline?: string;
  commercialUse?: boolean;
  name: string;
  email: string;
  company?: string;
  country?: string;
  extra?: string;
  createdAt: string;
}
