import Vue from 'vue'
import Snackbar2 from './Snackbar2'

import config from '../../utils/config'
import { use, registerComponentProgrammatic } from '../../utils/plugins'

const SnackbarProgrammatic2 = {
    open(params) {
        let message
        let parent
        if (typeof params === 'string') message = params

        const defaultParam = {
            type: 'is-success',
            position: config.defaultSnackbarPosition || 'is-bottom-right',
            message
        }
        if (params.parent) {
            parent = params.parent
            delete params.parent
        }
        const propsData = Object.assign(defaultParam, params)

        const vm = typeof window !== 'undefined' && window.Vue ? window.Vue : Vue
        const SnackbarComponent = vm.extend(Snackbar2)
        return new SnackbarComponent({
            parent,
            el: document.createElement('div'),
            propsData
        })
    }
}

const Plugin = {
    install(Vue) {
        registerComponentProgrammatic(Vue, '$snackbar2', SnackbarProgrammatic2)
    }
}

use(Plugin)

export default Plugin

export {
    SnackbarProgrammatic2 as Snackbar2
}
