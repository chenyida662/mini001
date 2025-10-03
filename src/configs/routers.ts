import LOGIN from '../pages/login.jsx';
import REGISTER from '../pages/register.jsx';
import HOME from '../pages/home.jsx';
import PROFILE from '../pages/profile.jsx';
import SETTINGS from '../pages/settings.jsx';
import DATA from '../pages/data.jsx';
export const routers = [{
  id: "login",
  component: LOGIN
}, {
  id: "register",
  component: REGISTER
}, {
  id: "home",
  component: HOME
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "settings",
  component: SETTINGS
}, {
  id: "data",
  component: DATA
}]