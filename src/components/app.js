import React, {Component} from 'react';

import DrawingCanvas from './canvas'
import AppToolbar from './toolbar'

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
})

const styles = theme => ({
    paper: {
        padding: theme.spacing(1),
        height: '100%'
    }
});

class App extends Component {
    render() {
        const { classes } = this.props;

        return(
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Grid container spacing={1}>
                    <Grid item xs={12}>     
                        <AppToolbar />
                    </Grid>
                    <Grid item xs={3}>  
                        <Paper className={classes.paper} >
                            <Typography variant="h6" className={classes.title}>
                                Inspector
                            </Typography>
                            <br/>
                            <Accordion >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Properties</AccordionSummary>
                                <AccordionDetails>
                                    ...
                                </AccordionDetails>
                            </Accordion>
                            <Accordion >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Physics</AccordionSummary>
                                <AccordionDetails>
                                    ...
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>     
                        <Paper className={classes.paper} >
                            <DrawingCanvas />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>         
                        <Paper className={classes.paper} >
                            Assets
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>         
                        <Container maxWidth="sm">
                            Copyright 2021 @ Tako.app
                        </Container>
                    </Grid>
                </Grid>   
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true }) (App);