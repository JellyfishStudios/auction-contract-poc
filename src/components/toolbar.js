import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import Typography from '@material-ui/core/Typography';

import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    paper: {
        padding: theme.spacing(1),
        height: '100%'
    }
});

class AppToolbar extends Component {
    render() {
        const { classes } = this.props;

        return(
            <AppBar position="static">
                <Toolbar>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>   
                            <Typography variant="h6" >
                                Tako
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <ToggleButtonGroup>
                                <ToggleButton >
                                    <TouchAppIcon />
                                </ToggleButton>
                                <ToggleButton >
                                    <StopOutlinedIcon />
                                </ToggleButton>
                                <ToggleButton >
                                    <TimelineOutlinedIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }   
}

export default withStyles(styles, { withTheme: true }) (AppToolbar);