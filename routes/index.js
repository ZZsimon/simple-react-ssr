import Home from '../view/Home';
import Login from '../view/Login';

export default [
    {
      path: '/',
      component: Home,
      exact: true,
    },
    {
      path: '/login',
      component: Login,
      getInitialProps: Login.getInitialProps,
      exact: true,
    },
];