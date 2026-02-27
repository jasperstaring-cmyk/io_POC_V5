import { createContext, useContext, useState } from 'react'
import { translations } from './i18n.js'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en")
  const t = (key) => translations[lang]?.[key] ?? translations["nl"]?.[key] ?? key
  // Translate segment name/desc by id
  const tSeg = (segId, field) => t(`seg_${segId}_${field}`)
  // Translate organisation type name/desc by id
  const tType = (typeId, field) => t(`type_${typeId}_${field}`)
  // Translate business size field by id (S/M/L/XL)
  const tBiz = (sizeId, field) => t(`biz_${sizeId}_${field}`)
  // Translate business intl size field
  const tBizIntl = (sizeId, field) => t(`biz_intl_${sizeId}_${field}`)
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tSeg, tType, tBiz, tBizIntl }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
