<template>
  <form class="form">
    <label for="search">
      <input
        id="search"
        :value="modelValue"
        required=""
        autocomplete="off"
        placeholder="search"
        type="text"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <div class="icon">
        <svg
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="swap-on"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
        </svg>
        <svg
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="swap-off"
        >
          <path
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
        </svg>
      </div>
      <button type="reset" class="close-btn">
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            clip-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            fill-rule="evenodd"
          ></path>
        </svg>
      </button>
    </label>
  </form>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.form {
  --padding: 1em;
  --rotate: 80deg;
  --gap: 1.5em;
  --icon-change-color: var(--primary);
  --height: 30px;
  flex: 1;
  margin-right: 20px;
  padding-inline-end: 1em;
  background: var(--border);
  position: relative;
  border-radius: 4px;
  -webkit-app-region: no-drag;
  transition: background 0.2s;
  color: var(--text);

  label {
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--height);

    input {
      width: 100%;
      padding-inline-start: calc(var(--padding) + var(--gap));
      outline: none;
      background: none;
      border: 0;
      color: var(--text);
      transition: color 0.2s;
      &::selection {
        background-color: var(--primary);
        color: var(--btn-text);
      }

      &:focus ~ .icon {
        transform: rotate(var(--rotate)) scale(1.3);
        .swap-off {
          opacity: 1;
          transform: rotate(-80deg);
          visibility: visible;
          color: var(--icon-change-color);
        }
        .swap-on {
          opacity: 0;
          visibility: visible;
        }
      }
      &:valid ~ .icon {
        transform: scale(1.3) rotate(var(--rotate));
        .swap-off {
          opacity: 1;
          visibility: visible;
          color: var(--icon-change-color);
        }
        .swap-on {
          opacity: 0;
          visibility: visible;
        }
      }
      &:valid ~ .close-btn {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        transition: 0.2s;
      }
    }

    svg {
      transition:
        0.3s cubic-bezier(0.4, 0, 0.2, 1),
        0.2s color;
      position: absolute;
      height: 15px;
    }

    .icon {
      position: absolute;
      left: var(--padding);
      transition:
        0.3s cubic-bezier(0.4, 0, 0.2, 1),
        0s color;
      display: flex;
      justify-content: center;
      align-items: center;

      .swap-off {
        transform: rotate(-80deg);
        opacity: 0;
        visibility: hidden;
      }
    }

    /* close button */
    .close-btn {
      /* removing default bg of button */
      background: none;
      border: none;
      right: calc(var(--padding) - var(--gap));
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.1em;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      transition: 0.3s;
      opacity: 0;
      transform: scale(0);
      visibility: hidden;
      cursor: pointer;
      svg {
        color: var(--text);
        transition: all 0.2s;
      }
    }
  }
}
</style>
