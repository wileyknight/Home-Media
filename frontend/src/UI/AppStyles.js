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
exports.useStyles = void 0;
var styles_1 = require("@material-ui/core/styles");
function imageX(slider, hover) {
    if (hover === void 0) { hover = 0; }
    var size = 150 + hover;
    if (typeof (slider) === 'number') {
        return size + slider;
    }
    return size;
}
function imageY(slider, hover) {
    if (hover === void 0) { hover = 0; }
    var size = 150 + hover;
    var aspect = .6938;
    if (typeof (slider) === 'number') {
        return (size + slider) / aspect;
    }
    return size;
}
exports.useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        root: {
            minWidth: 32,
            fontSize: '1.1rem',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 12,
            '&:hover': {
                backgroundColor: 'rgb(240,199,0)',
                color: 'black',
                padding: '0px 4px',
            },
        },
        title: {
            fontSize: 22,
            position: 'absolute',
        },
        wrapper: {
            height: '100%',
            paddingTop: 150,
            paddingLeft: 15,
        },
        list: {
            listStyle: 'none',
            padding: 0,
            marginLeft: 5,
            display: 'block',
            height: 28,
        },
        tabs: {
            position: 'fixed',
            top: 92,
            zIndex: 75,
            marginLeft: -24,
        },
        drawer: {
            width: theme.constants.drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: theme.constants.drawerWidth,
            backgroundColor: '#000',
        },
        drawerHeader: __assign(__assign({ display: 'flex', alignItems: 'center', padding: theme.spacing(0, 1) }, theme.mixins.toolbar), { justifyContent: 'flex-end' }),
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        sorting: {
            position: 'fixed',
            top: 100,
            right: 5,
            zIndex: 100,
        },
        scale: {
            position: 'fixed',
            top: 0,
            left: 50,
            width: '90%',
            zIndex: 200,
            height: 0,
        },
        alphabet: {
            position: 'fixed',
            padding: 0,
            margin: 0,
            top: 250,
            left: 0,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: theme.constants.drawerWidth,
        },
        li: {
            display: 'inline-block',
            width: function (props) { return imageX(props.size); },
            height: function (props) { return imageY(props.size); },
            position: 'relative',
            verticalAlign: 'top',
            margin: 10,
            opacity: 0.7,
            zIndex: 0,
            backgroundImage: 'url("/images/missing_image.png")',
            backgroundSize: 'cover',
            textDecoration: 'none',
            overflow: 'hidden',
            '&:hover': {
                margin: 0,
                width: function (props) { return imageX(props.size) + 20; },
                height: function (props) { return imageY(props.size) + 20; },
                opacity: 1,
                boxShadow: '0 0 50px black',
                zIndex: 10,
            },
        },
        liAlpha: {
            display: 'block',
            verticalAlign: 'top',
            padding: 5,
            width: '100%',
        },
        size: {
            position: 'fixed',
            top: 175,
            width: 300,
        },
    });
});
//# sourceMappingURL=AppStyles.js.map