import studio from '@theatre/studio'
import { getProject } from '@theatre/core'

class Theatre {
    constructor() {
        studio.initialize();

        this.project = getProject('Theatre');

        this.sheet = this.project.sheet('Animated scene');
    }
}

export default new Theatre();