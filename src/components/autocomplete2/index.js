import Autocomplete2 from './Autocomplete2'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
    install(Vue) {
        registerComponent(Vue, Autocomplete2)
    }
}

use(Plugin)

export default Plugin

export {
    Autocomplete2
}
