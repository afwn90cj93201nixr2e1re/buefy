<template>
    <div class="collapse">
        <slot name="header" :open123="isOpen"/>
        <div
            v-if="isTrigger"
            class="collapse-trigger"
            @click="toggle">
            <slot name="trigger" :open="isOpen" />
        </div>
        <transition :name="animation">
            <div
                :id="ariaId"
                :aria-expanded="isOpen"
                class="collapse-content"
                v-show="isOpen">
                <slot name="body"/>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'BCollapse',
    props: {
        open: {
            type: Boolean,
            default: false
        },
        animation: {
            type: String,
            default: 'fade'
        },
        ariaId: {
            type: String,
            default: ''
        },
        isTrigger: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isOpen: this.open
        }
    },
    watch: {
        open(value) {
            this.isOpen = value
        }
    },
    methods: {
        /**
            * Toggle and emit events
            */
        toggle() {
            this.isOpen = !this.isOpen
            this.$emit('update:open', this.isOpen)
            this.$emit(this.isOpen ? 'open' : 'close')
        }
    }
}
</script>
