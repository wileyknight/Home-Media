"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_transition_group_1 = require("react-transition-group");
var App_1 = require("../App");
var Media_1 = require("../Media/Media");
var NotFoundPage_1 = require("./NotFoundPage");
var Routes = function (props) {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement("div", { className: 'MainWrapper' },
            React.createElement(react_transition_group_1.TransitionGroup, null,
                React.createElement(react_transition_group_1.CSSTransition, { timeout: 500, classNames: 'animate' },
                    React.createElement(react_router_dom_1.Switch, null,
                        React.createElement(react_router_dom_1.Route, { exact: true, path: '/:mediatype?', component: App_1.default }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: '/media/:mediatype/:title/:current?', component: Media_1.default }),
                        React.createElement(react_router_dom_1.Route, { component: NotFoundPage_1.default })))))));
};
exports.default = Routes;
//# sourceMappingURL=Routes.js.map