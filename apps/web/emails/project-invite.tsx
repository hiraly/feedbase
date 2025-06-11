import * as React from 'react';
import {
  Body,
  Button,
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
import { formatRootUrl } from '@/lib/utils';

interface ProjectInviteEmailProps {
  email: string;
  invitedByFullName: string;
  invitedByEmail: string;
  projectName: string;
  inviteLink: string;
}

export default function ProjectInviteEmail({
  email,
  invitedByFullName,
  invitedByEmail,
  projectName,
  inviteLink,
}: ProjectInviteEmailProps) {
  const previewText = `Join ${projectName} on Feedbase`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ margin: 'auto', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
        <Container
          style={{
            margin: 'auto',
            marginTop: '40px',
            marginBottom: '40px',
            width: '465px',
            borderRadius: '4px',
            border: '1px solid #eaeaea',
            padding: '20px',
          }}>
          <Section style={{ marginTop: '32px' }}>
            <Img
              src={`${formatRootUrl()}/icon-512x512.png`}
              width='40'
              height='40'
              alt='Feedbase'
              style={{ margin: 'auto', borderRadius: '6px' }}
            />
          </Section>
          <Heading
            style={{
              margin: '0',
              marginTop: '30px',
              marginBottom: '30px',
              padding: '0',
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 'normal',
              color: 'black',
            }}>
            Join <strong>{projectName}</strong> on <strong>Feedbase</strong>
          </Heading>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: 'black' }}>
            <strong>{invitedByFullName}</strong> (
            <Link href={`mailto:${invitedByEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
              {invitedByEmail}
            </Link>
            ) has invited you to the <strong>{projectName}</strong> team on <strong>Feedbase</strong>.
          </Text>
          <Section style={{ marginBottom: '32px', marginTop: '32px', textAlign: 'center' }}>
            <Button
              style={{
                borderRadius: '6px',
                backgroundColor: '#000000',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none',
              }}
              href={inviteLink}>
              Join the team
            </Button>
          </Section>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: 'black' }}>
            or copy and paste this URL into your browser:{' '}
            <Link href={inviteLink} style={{ color: '#2563eb', textDecoration: 'none' }}>
              {inviteLink}
            </Link>
          </Text>
          <Hr
            style={{
              margin: '0',
              marginTop: '26px',
              marginBottom: '26px',
              width: '100%',
              border: '1px solid #eaeaea',
            }}
          />
          <Text style={{ fontSize: '12px', lineHeight: '24px', color: '#666666' }}>
            This invitation was intended for <span style={{ color: 'black' }}>{email}</span>. If you were not
            expecting this invitation, you can ignore this email. If you are concerned about your
            account&apos;s safety, please reply to this email to get in touch with us.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
