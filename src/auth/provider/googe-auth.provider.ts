import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export const GoogleOAuth2ClientProvider: Provider = {
  provide: OAuth2Client,
  useFactory: async (configService: ConfigService) => {
    return new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'));
  },
  inject: [ConfigService],
};
