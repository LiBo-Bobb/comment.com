import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import 'react-weui'
import "weui";
import 'react-weui/build/packages/react-weui.css';
import StudyRecord from './compoents/study_record/StudyRecord'
import './index.css';
import App from './App';
//回复当前的评论
import TwoCommentList from './compoents/two_comment_list/TwoCommentList'
import registerServiceWorker from './registerServiceWorker';

let route = <Router history={hashHistory}>
    <Route path="/" component={App}>
        <Route path="/two_comment/:commentId" component={TwoCommentList}>
        </Route>
    </Route>
</Router>

ReactDOM.render(route, document.getElementById('root'));
registerServiceWorker();
