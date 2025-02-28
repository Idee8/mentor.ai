import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const WelcomeEmail = () => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>The AI-powered workspace to mentor you on any codebase.</Preview>
      <Container style={container}>
        <Text style={paragraph}>Hi</Text>
        <Text style={paragraph}>
          Thanks for signing up for Mentor AI! You're now on the waitlist, and
          we’ll invite you as soon as a slot opens up.
        </Text>
        {/* <Section style={btnContainer}>
          <Button style={button} href="https://getkoala.com">
            Get started
          </Button>
        </Section> */}
        <Text style={paragraph}>
          Best,
          <br />
          The Mentor AI team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          470 Noor Ave STE B #1148, South San Francisco, CA 94080
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

// const btnContainer = {
//   textAlign: "center" as const,
// };

// const button = {
//   backgroundColor: "#5F51E8",
//   borderRadius: "3px",
//   color: "#fff",
//   fontSize: "16px",
//   textDecoration: "none",
//   textAlign: "center" as const,
//   display: "block",
//   padding: "12px",
// };

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
