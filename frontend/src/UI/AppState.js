"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaReducer = exports.initialMovieListState = void 0;
exports.initialMovieListState = {
    moviesData: { loaded: false, matched: [], alerts: [] },
    seriesData: { loaded: false, matched: [], alerts: [] },
    liveData: { loaded: false, matched: [], alerts: [] },
    filipinoData: { loaded: false, matched: [], alerts: [] },
    searchMedia: [],
    data: { loaded: false, matched: [], alerts: [] },
    count: [],
    value: 0,
    open: false,
    path: '',
    editing: false,
    sort: 'alpha',
    direction: true,
    size: 3,
    view: true,
};
exports.mediaReducer = function (state, action) {
    switch (action.type) {
        case 'update_movies': {
            return __assign(__assign({}, state), { moviesData: action.payload, searchMedia: action.payload.matched, count: action.payload.alerts });
        }
        case 'update_series': {
            return __assign(__assign({}, state), { seriesData: action.payload, searchMedia: action.payload.matched, count: action.payload.alerts });
        }
        case 'update_live': {
            return __assign(__assign({}, state), { liveData: action.payload, searchMedia: action.payload.matched, count: action.payload.alerts });
        }
        case 'update_filipino': {
            return __assign(__assign({}, state), { filipinoData: action.payload, searchMedia: action.payload.matched, count: action.payload.alerts });
        }
        case 'update_search': {
            return __assign(__assign({}, state), { searchMedia: action.payload });
        }
        case 'update_data': {
            return __assign(__assign({}, state), { data: action.payload, count: action.payload.alerts });
        }
        case 'set_value': {
            return __assign(__assign({}, state), { value: action.payload });
        }
        case 'set_open': {
            return __assign(__assign({}, state), { open: action.payload });
        }
        case 'set_sort': {
            var dataset = eval("state." + action.area);
            console.log(dataset);
            return __assign(__assign({}, state), { sort: action.payload, searchMedia: dataset.matched });
        }
        case 'update_path': {
            return __assign(__assign({}, state), { path: action.payload });
        }
        case 'update_size': {
            return __assign(__assign({}, state), { size: action.payload });
        }
        case 'set_sortDirection': {
            return __assign(__assign({}, state), { direction: !state.direction });
        }
        case 'update_editing': {
            return __assign(__assign({}, state), { editing: !state.editing });
        }
        case 'update_view': {
            return __assign(__assign({}, state), { view: !state.view });
        }
        default: {
            return state;
        }
    }
};
//# sourceMappingURL=AppState.js.map