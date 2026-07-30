import { useSiteData } from '../context/SiteDataContext'

export default function StickyWhatsapp() {
  const { siteInfo } = useSiteData()
  const url = `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent('Hi, I want to know more about admissions at ' + siteInfo.name + ' ' + siteInfo.nameSuffix)}`

  return (
    <a
      className="sticky-whatsapp"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      ☏
    </a>
  )
}
