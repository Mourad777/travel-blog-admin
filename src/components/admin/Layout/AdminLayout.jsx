import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail'
import SettingsIcon from '@material-ui/icons/Settings'
import StarBorder from '@material-ui/icons/StarBorder'
import PostAddIcon from '@material-ui/icons/PostAdd';
import CommentIcon from '@material-ui/icons/Comment';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import PhotoIcon from '@material-ui/icons/PhotoLibrary'
import VideoIcon from '@material-ui/icons/MovieCreation';
import { useHistory } from 'react-router';
import CategoriesIcon from '@material-ui/icons/AccountTree';
import CountriesIcon from '@material-ui/icons/Public';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function PersistentDrawerLeft({ children }) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState('');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [nestedOpen, setNestedOpen] = useState(false);

    const handleClick = () => {
        setNestedOpen(!nestedOpen);
    };

    history.listen((location, action) => {
        setLocation(location.pathname)
    });

    useEffect(() => {
        const path = history.location.pathname;
        setLocation(path);
        if (path === '/admin/create-post' || path === '/admin/posts') {
            setNestedOpen(true)
        }
    }, []);


    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Blog admin panel
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>


                    <ListItem button onClick={handleClick}>
                        <ListItemIcon>
                            <ChromeReaderModeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Posts" />
                        {nestedOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {[
                                { text: 'New post', icon: PostAddIcon, url: '/admin/create-post' },
                                { text: 'View posts', icon: DynamicFeedIcon, url: '/admin/posts' },
                                // { text: 'Comments', icon: CommentIcon }
                            ].map((item, index) => (
                                <ListItem style={item.url === location ? { background: 'rgb(240,240,240)' } : {}} onClick={() => history.push(item.url)} button key={item.text} className={classes.nested}>
                                    <ListItemIcon><item.icon /></ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))}

                        </List>
                    </Collapse>


                    {[
                        { text: 'Photos', icon: PhotoIcon, url: '/admin/photos' },
                        { text: 'Videos', icon: VideoIcon, url: '/admin/videos' },
                        { text: 'Categories', icon: CategoriesIcon, url: '/admin/categories' },
                        { text: 'Countries', icon: CountriesIcon, url: '/admin/countries' },
                    ].map((item, index) => (
                        <ListItem style={item.url === location ? { background: 'rgb(240,240,240)' } : {}} onClick={() => history.push(item.url)} button key={item.text}>
                            <ListItemIcon><item.icon /></ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {[
                        { text: 'Messages', icon: MailIcon, url: '/admin/messages' },
                        { text: 'Settings', icon: SettingsIcon, url: '/admin/settings' },
                        // { text: 'Videos', icon: VideoIcon, url: '/admin/videos' },
                    ].map((item, index) => (
                        <ListItem
                            style={item.url === location ? { background: 'rgb(240,240,240)' } : {}}
                            onClick={() => history.push(item.url)} button key={item.text}>
                            <ListItemIcon><item.icon /></ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}


                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {children}
            </main>
        </div>
    );
}