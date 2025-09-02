import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Application data
const applications = [
  {
    title: 'AMT Backend',
    description: 'Account Management Tool - Comprehensive backend API for customer lifecycle management',
    link: '/docs/amt/intro',
    status: 'Production',
    tech: ['TypeScript', 'Express', 'MySQL', 'Redis'],
    features: [
      'Customer account management',
      'Payment processing',
      'Commission calculations',
      'Product catalog',
      'KYC verification'
    ]
  },
  {
    title: '360 Platform',
    description: 'Frontend application for internal operations and management',
    link: '#',
    status: 'Coming Soon',
    tech: ['React', 'Node.js'],
    features: []
  },
  {
    title: 'FMA (Field Management App)',
    description: 'Mobile application for field agents and operations',
    link: '#',
    status: 'Coming Soon',
    tech: ['React Native'],
    features: []
  },
  {
    title: 'Customer Portal',
    description: 'Self-service portal for customer account management',
    link: '#',
    status: 'Coming Soon',
    tech: ['React', 'TypeScript'],
    features: []
  },
  {
    title: 'M-Pesa Integration',
    description: 'Mobile money payment gateway integration service',
    link: '#',
    status: 'Coming Soon',
    tech: ['Node.js', 'Express'],
    features: []
  },
  {
    title: 'Sales Portal',
    description: 'Sales team management and lead tracking system',
    link: '#',
    status: 'Coming Soon',
    tech: ['React', 'Node.js'],
    features: []
  },
  {
    title: 'IoT Platform',
    description: 'Device management and monitoring system',
    link: '#',
    status: 'Coming Soon',
    tech: ['Python', 'MQTT'],
    features: []
  }
];

function ApplicationCard({app}: {app: typeof applications[0]}) {
  const isActive = app.status === 'Production';
  
  return (
    <div className={clsx('col col--6', styles.applicationCard)}>
      <div className="card" style={{height: '100%', position: 'relative'}}>
        <div className="card__header">
          <h3>{app.title}</h3>
          <span className={clsx('badge', isActive ? 'badge--success' : 'badge--secondary')} 
                style={{position: 'absolute', top: '1rem', right: '1rem'}}>
            {app.status}
          </span>
        </div>
        <div className="card__body">
          <p>{app.description}</p>
          {app.tech.length > 0 && (
            <div style={{marginBottom: '1rem'}}>
              {app.tech.map((tech, idx) => (
                <span key={idx} className="badge badge--primary" style={{marginRight: '0.5rem'}}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          {app.features.length > 0 && (
            <ul style={{fontSize: '0.9rem', marginBottom: '1rem'}}>
              {app.features.slice(0, 3).map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
              {app.features.length > 3 && <li>...and more</li>}
            </ul>
          )}
        </div>
        <div className="card__footer">
          {isActive ? (
            <Link
              className="button button--primary button--block"
              to={app.link}>
              View Documentation
            </Link>
          ) : (
            <button className="button button--secondary button--block" disabled>
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started with SunCulture Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

function ApplicationsSection() {
  return (
    <section className={styles.applications}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">Applications</Heading>
          <p>Explore documentation for SunCulture's technical platforms and services</p>
        </div>
        <div className="row">
          {applications.map((app, idx) => (
            <ApplicationCard key={idx} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className={clsx('hero hero--light', styles.quickLinks)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">Quick Links</Heading>
        </div>
        <div className="row">
          <div className="col col--4">
            <div className="text--center">
              <h3>API References</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><Link to="/docs/amt/api-reference">AMT API</Link></li>
                <li><Link to="#">Payment Gateway APIs</Link></li>
                <li><Link to="#">Integration Guides</Link></li>
              </ul>
            </div>
          </div>
          <div className="col col--4">
            <div className="text--center">
              <h3>Development</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><Link to="/docs/amt/getting-started">Getting Started</Link></li>
                <li><Link to="/docs/amt/architecture">Architecture</Link></li>
                <li><Link to="/docs/amt/database">Database Schema</Link></li>
              </ul>
            </div>
          </div>
          <div className="col col--4">
            <div className="text--center">
              <h3>Operations</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><Link to="/docs/amt/deployment">Deployment Guide</Link></li>
                <li><Link to="#">Monitoring</Link></li>
                <li><Link to="#">Troubleshooting</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="Technical documentation for SunCulture applications and services">
      <HomepageHeader />
      <main>
        <ApplicationsSection />
        <QuickLinks />
      </main>
    </Layout>
  );
}