import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { getWindowSizeInteger } from "./utility/utility";
import _ from "lodash";
import Loader from "./components/Loader/Loader";
import 'semantic-ui-css/semantic.min.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const AdminLayout = React.lazy(() => import("./components/Layout/AdminLayout"));
const RegisterUser = React.lazy(() => import("./pages/register/Register"));
const Login = React.lazy(() => import("./pages/login/Login"));
const Posts = React.lazy(() => import("./pages/posts/Posts"));
const Comments = React.lazy(() => import("./pages/comments/Comments"));
const CreatePost = React.lazy(() => import("./pages/create-post/CreatePost"));
const Images = React.lazy(() => import("./pages/images/Images"));
const Videos = React.lazy(() => import("./pages/videos/Videos"));
const Messages = React.lazy(() => import("./pages/messages/Messages"));
const Message = React.lazy(() => import("./pages/messages/Message"));
const Categories = React.lazy(() => import("./pages/categories/Categories"));
const Countries = React.lazy(() => import("./pages/countries/Countries"));
const Settings = React.lazy(() => import("./pages/settings/Settings"));

const App = () => {

  const [winSize, setWinSize] = useState(getWindowSizeInteger(window.innerWidth));

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn)
  }

  useEffect(() => {
    if (!!localStorage.getItem('token')) {
      handleLogin(true)
    }

    window.addEventListener("resize", _.throttle(getWindowSize, 200), { passive: true });
  }, []);

  const getWindowSize = () => {
    const windowSizeWidthInt = getWindowSizeInteger(window.innerWidth);
    setWinSize(windowSizeWidthInt);
  };

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}>
        <Switch>
          <AdminLayout onLogin={handleLogin} isLoggedIn={isLoggedIn}>
            <Route exact path="/register">
              <RegisterUser onLogin={handleLogin} winSize={winSize} />
            </Route>
            <Route exact path="/login">
              <Login onLogin={handleLogin} winSize={winSize} />
            </Route>
            <PrivateRoute isLoggedIn={isLoggedIn} winSize={winSize} path="/posts" component={Posts} />
            <PrivateRoute isLoggedIn={isLoggedIn} isPost path="/post/:id/comments" component={Comments} />
            <PrivateRoute isLoggedIn={isLoggedIn} isVideo path="/video/:id/comments" component={Comments} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/create-post" component={CreatePost} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/edit-post/:id" isEditing component={CreatePost} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/photos" component={Images} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/videos" component={Videos} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/categories" component={Categories} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/countries" component={Countries} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/messages" component={Messages} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/message/:id" component={Message} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/settings" component={Settings} />
            {/* {isLoggedIn ? <Redirect to="/posts" /> : <Redirect to="/login" />} */}
            {!isLoggedIn && (<Redirect to="/login" />)}
          </AdminLayout>
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
