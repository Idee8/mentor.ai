import { BASE_URL } from '@/lib/constants';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface RaycastMagicLinkEmailProps {
  magicLink?: string;
}

export const MagicLinkEmail = ({ magicLink }: RaycastMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Log in with this magic link.</Preview>
      <Container style={container}>
        <Img
          src={`${BASE_URL}/static/mentor.png`}
          width={100}
          height={48}
          alt="Mentor"
        />
        <Heading style={heading}>🪄 Your magic link</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={magicLink}>
              👉 Click here to verify your email 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            If you didn't request this, please ignore this email.
          </Text>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />- Mentor AI Team
        </Text>
        <Hr style={hr} />
        <Img
          src={`${BASE_URL}/static/mentor-black-logo.svg`}
          width={32}
          height={32}
          style={{
            WebkitFilter: 'grayscale(100%)',
            filter: 'grayscale(100%)',
            margin: '20px 0',
          }}
        />
        <Text style={footer}>Mentor AI Labs.</Text>
        <Text style={footer}>2093 Kigali #3222, Rwanda, NR 02</Text>
      </Container>
    </Body>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  magicLink: BASE_URL,
} as RaycastMagicLinkEmailProps;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 25px 48px',
  backgroundImage: 'url("https://demo.react.email/static/raycast-bg.png")',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
};

const body = {
  margin: '24px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const link = {
  color: '#FF6363',
};

const hr = {
  borderColor: '#dddddd',
  marginTop: '48px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginLeft: '4px',
};
