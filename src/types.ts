export type MicrosoftTeamsTeam = {
  id: string;
  displayName: string;
  description: string;
  visibility: string;
  mail: string;
  securityEnabled: boolean;
  mailEnabled: boolean;
  createdDateTime: string;
  expirationDateTime: string;
  deletedDateTime: string;
  renewedDateTime: string;
};

export type MicrosoftTeamsChannel = {
  id: string;
  displayName: string;
  description: string;
  isFavoriteByDefault: boolean;
  email: string;
  membershipType: string;
  createdDateTime: string;
  webUrl: string;
};

export type MicrosoftTeamsUser = {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
  id: string;
};

export type MicrosoftTeamsTeamMember = {
  displayName: string;
  userId: string;
  email: string;
  tenantId: string;
};
