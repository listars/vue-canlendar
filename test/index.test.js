import {shallowMount} from '@vue/test-utils'
import Component from '../src'

import Vue from 'vue'
import fecha from 'fecha'

describe('Component', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(Component)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
