import { mount } from 'vue-test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import sum from './sum'


describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.isVueInstance()).toBeTruthy()
  });

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
