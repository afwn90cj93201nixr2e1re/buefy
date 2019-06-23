import Dropdown2 from './Dropdown'
import DropdownItem2 from './DropdownItem'

import { use, registerComponent } from '../../utils/plugins'

const Plugin = {
    install(Vue) {
        registerComponent(Vue, Dropdown2)
        registerComponent(Vue, DropdownItem2)
    }
}

use(Plugin)

export default Plugin

export {
    Dropdown2,
    DropdownItem2
}
