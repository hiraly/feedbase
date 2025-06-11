import * as React from 'react';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
} from '@react-email/components';
import { formatRootUrl } from '@/lib/utils';

interface ChangelogEmailProps {
  subId: string;
  projectSlug: string;
  changelog: {
    title: string;
    content: string;
    publish_date: string;
    summary: string;
    image: string;
    slug: string;
    author: {
      full_name: string;
      avatar_url: string;
    };
  };
}

export default function ChangelogEmail({ subId, projectSlug, changelog }: ChangelogEmailProps) {
  return (
    <Html>
      <Preview>{changelog.summary}</Preview>
      <Head />
      <Body style={{ margin: 'auto', backgroundColor: 'white', padding: '12px', fontFamily: 'sans-serif' }}>
        <Container>
          {/* Title */}
          <Heading style={{ fontSize: '30px', fontWeight: '500', color: 'black' }}>{changelog.title}</Heading>

          {/* Image */}
          <Img
            src={changelog.image || ''}
            alt='Thumbnail'
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
          />

          {/* Author & Share */}
          <Section style={{ paddingBottom: '24px', paddingTop: '16px' }}>
            <Row>
              <Column style={{ minWidth: '40px' }}>
                <Img
                  src={changelog.author.avatar_url || ''}
                  alt={changelog.author.full_name}
                  style={{ height: '40px', width: '40px', borderRadius: '50%' }}
                />
              </Column>
              <Column style={{ width: '100%', paddingLeft: '12px' }}>
                <Row>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(0,0,0,0.9)' }}>
                    {changelog.author.full_name}
                  </span>

                  <Column style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)' }}>
                    <time dateTime={changelog.publish_date}>
                      {new Date(changelog.publish_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </Column>
                </Row>
              </Column>
              <Column>
                <Link
                  style={{ color: 'rgba(0,0,0,0.85)' }}
                  href={`https://twitter.com/intent/tweet?text=Make sure to check out ${changelog.title} by ${
                    changelog.author.full_name
                  }!&url=${formatRootUrl(projectSlug, `/changelog/${changelog.slug}`)}`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Img src='https://svgl.app/library/twitter.svg' style={{ height: '24px', width: '24px' }} />
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Content as html */}
          <div
            style={{
              width: '100%',
              minWidth: '100%',
              fontWeight: 'normal',
              color: 'rgba(0,0,0,0.7)',
              lineHeight: '1.6',
            }}
            dangerouslySetInnerHTML={{ __html: changelog.content }}
          />

          {/* Separator */}
          <Hr style={{ marginTop: '32px', borderColor: 'rgba(0,0,0,0.2)' }} />

          <div
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              paddingTop: '16px',
              paddingBottom: '16px',
            }}>
            <Link
              href={formatRootUrl(projectSlug, `/changelog/unsubscribe?subId=${subId}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '300',
                color: 'rgba(0,0,0,0.7)',
                textDecoration: 'underline',
              }}>
              Unsubscribe
            </Link>
            <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'rgba(0,0,0,0.7)' }}>•</span>
            <Link
              href={formatRootUrl(projectSlug, `/changelog/${changelog.slug}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '300',
                color: 'rgba(0,0,0,0.7)',
                textDecoration: 'underline',
              }}>
              View in browser
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Link
              href='https://feedbase.app'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 'normal',
                color: 'rgba(0,0,0,0.7)',
              }}>
              <Img
                src='https://feedbase.app/icon-512x512.png'
                alt='Feedbase'
                style={{ height: '32px', width: '32px', borderRadius: '6px' }}
              />
              Powered by Feedbase
            </Link>
          </div>
        </Container>
      </Body>
    </Html>
  );
}
