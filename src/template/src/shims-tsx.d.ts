import Vue, { VueConstructor, VNode } from "vue";
import { WebStorage } from "vue-ls";
import { notification, Form } from "ant-design-vue";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  interface Window {
    stream: any;
    AudioContext: any;
    webkitAudioContext: any;
  }
}

declare module "vue/types/vue" {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $http: any;
    $auth: any;
    $bus: any;
    $nprogress: any;
    $form: Form;
    $notification: typeof notification;
    router: any;
    ls: WebStorage;
  }
  interface Vue {
    $http: any;
    $auth: any;
    $bus: any;
    $nprogress: any;
    $form: Form;
    $notification: typeof notification;
    router: any;
    ls: WebStorage;
  }
}
