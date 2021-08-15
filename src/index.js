import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { getWindowSizeInteger } from "./utility/utility";
import _ from "lodash";
import Loader from "./components/Loader/Loader";
import 'semantic-ui-css/semantic.min.css';

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

  useEffect(() => {
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
          <AdminLayout>
            <Route exact path="/register">
              <RegisterUser winSize={winSize} />
            </Route>
            <Route exact path="/login">
              <Login winSize={winSize} />
            </Route>
            <Route exact path="/posts">
              <Posts winSize={winSize} />
            </Route>
            <Route exact path="/post/:id/comments">
              <Comments isPost />
            </Route>
            <Route exact path="/video/:id/comments">
              <Comments isVideo />
            </Route>
            <Route exact path="/create-post">
              <CreatePost />
            </Route>
            <Route exact path="/edit-post/:id">
              <CreatePost isEditing />
            </Route>
            <Route exact path="/photos">
              <Images />
            </Route>
            <Route exact path="/videos">
              <Videos />
            </Route>
            <Route exact path="/categories">
              <Categories />
            </Route>
            <Route exact path="/countries">
              <Countries />
            </Route>
            <Route exact path="/messages">
              <Messages />
            </Route>
            <Route exact path="/message/:id">
              <Message />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
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
