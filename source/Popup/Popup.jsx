import * as React from 'react'
//import browser from 'webextension-polyfill'
import { useTranslation } from 'react-i18next'

/*function openWebPage(url) {
  return browser.tabs.create({ url })
}*/

const Popup = () => {
  const { t } = useTranslation()
  return (
    <div>
      {t('test')}
    </div>
  )
}

export default Popup