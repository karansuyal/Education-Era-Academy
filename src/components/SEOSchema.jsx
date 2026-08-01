import { useEffect } from 'react'
import { useSiteData } from '../context/SiteDataContext'

// Injects JSON-LD structured data (schema.org/EducationalOrganization) into
// <head>. This doesn't change what users see — it helps Google understand
// what the business is, its address/phone, and its courses, which can
// improve how (and how often) the site shows up in search results and
// Google Maps/Business listings.
export default function SEOSchema() {
  const { siteInfo, batches } = useSiteData()

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: `${siteInfo.name} ${siteInfo.nameSuffix || ''}`.trim(),
      description:
        'Coaching for Class 9-12, Government Exam Preparation, and Computer Applications & Coding.',
      url: 'https://education-era-academy.vercel.app/',
      telephone: siteInfo.phone,
      email: siteInfo.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteInfo.address,
      },
      ...(batches?.length
        ? {
            hasCourse: batches.map((b) => ({
              '@type': 'Course',
              name: b.title,
              description: b.description,
            })),
          }
        : {}),
    }

    let tag = document.getElementById('org-schema')
    if (!tag) {
      tag = document.createElement('script')
      tag.id = 'org-schema'
      tag.type = 'application/ld+json'
      document.head.appendChild(tag)
    }
    tag.textContent = JSON.stringify(schema)
  }, [siteInfo, batches])

  return null
}
