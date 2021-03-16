import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline } from '@material-ui/core';

import AppToolbar from './toolbar'

const theme = createMuiTheme({
    palette: {
        type: 'light'
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
                    <Grid item xs={12}>   
                        <Grid item xs={12}>  
                            <Typography variant="h5" >
                                Connecting animal shelters all over the world, with those that care.  
                            </Typography>
                        </Grid>
                        <Grid item xs={12}> 
                            <Button>Create</Button>
                        </Grid>
                        <Grid item xs={12}> 
                            <Typography variant="h6" >
                                How does Tako work?  
                            </Typography>
                            <Typography>
                                Animal shelters are able to register for verification, and once verified, are able to mint a new collection of NFT's, each of which represents an animal in their care. Everytime they take in a new animal, they're able to mint a new NFT representing the animal, including a profile picture, and stats such as breed, age, name, etc. These NFT's can then be put up for adoption, where indivduals who wish to donate can do so by bidding on the NFT, which will become theres once the adoption process completes. Those that don't wish to adopt can still help these animals, by 'liking' them, upon doing so will initiate a small donation to the animal/shelter in question. 
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>         
                        <Container maxWidth="sm">
                            Copyright 2021 @ Tako
                        </Container>
                    </Grid>
                </Grid>   
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles, { withTheme: true }) (App);