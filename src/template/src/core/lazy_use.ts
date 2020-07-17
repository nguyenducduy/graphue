import { Vue } from "vue-property-decorator";
import VueStorage from "vue-ls";
import settings from "@/config/settings";
import "../assets/global.scss";
import "../assets/styles/tailwind.scss";

// import base library
import {
  Avatar,
  TreeSelect,
  Rate,
  Breadcrumb,
  InputNumber,
  Upload,
  Button,
  Layout,
  Table,
  Icon,
  Progress,
  Radio,
  Dropdown,
  Menu,
  Input,
  Badge,
  Form,
  Tooltip,
  Select,
  Switch,
  Tag,
  Affix,
  Spin,
  Checkbox,
  Tabs,
  Pagination,
  notification,
  Drawer,
  Result,
  Popconfirm,
  BackTop
} from "ant-design-vue";
import Vue2Filters from "vue2-filters";
import VueAuthenticate from "vue-authenticate";
import { Can } from "@casl/vue";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
//common admin component
import DeleteButton from "@/components/Admin/DeleteButton/index.vue";
import SearchInput from "@/components/Admin/SearchInput/index.vue";

//global event bus
const EventBus = new Vue();
Vue.prototype.$bus = EventBus;

//socketio
const socket = io(`${process.env.VUE_APP_SOCKETIO_URI}`, {
  transports: ["websocket"]
});

Vue.use(VueSocketIOExt, socket);
Vue.use(VueAuthenticate, settings.googleAuthOptions);
Vue.use(VueStorage, settings.storageOptions);
Vue.use(Vue2Filters, settings.vue2filterOptions);
Vue.component("Can", Can);
Vue.component("d-button", DeleteButton);
Vue.component("s-input", SearchInput);

Vue.use(Avatar);
Vue.use(Button);
Vue.use(Rate);
Vue.use(TreeSelect);
Vue.use(Breadcrumb);
Vue.use(Layout);
Vue.use(Table);
Vue.use(Icon);
Vue.use(Progress);
Vue.use(Radio);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Input);
Vue.use(Badge);
Vue.use(Form);
Vue.use(Tooltip);
Vue.use(Select);
Vue.use(Tag);
Vue.use(Affix);
Vue.use(Spin);
Vue.use(Checkbox);
Vue.use(Tabs);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(InputNumber);
Vue.use(Drawer);
Vue.use(Switch);
Vue.use(Result);
Vue.use(Popconfirm);
Vue.use(BackTop);

notification.config(settings.notification);
Vue.prototype.$notification = notification;
