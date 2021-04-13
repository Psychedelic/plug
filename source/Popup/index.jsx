import * as React from 'react'
import ReactDOM from 'react-dom'
import Popup from './Popup'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import initConfig from '../locales'

i18n.use(initReactI18next).init(initConfig)

ReactDOM.render(<Popup />, document.getElementById('popup-root'))