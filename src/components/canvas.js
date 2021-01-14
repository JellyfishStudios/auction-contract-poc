import React, {Component} from 'react';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    canvas: {
        background: theme.palette.background.paper,
        height: '100%',
        width: '100%'
    }
});

class DrawingCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
          number : 0
        }

        this.canvasRef = React.createRef();
    }

    drawLine() {
        const ctx = this.canvasRef.current.getContext("2d");

        ctx.moveTo(0, 0);
        ctx.lineTo(200, 100);
        ctx.stroke();
    }

    render() {
        const { classes } = this.props;

        return(
            <canvas ref={this.canvasRef} className={classes.canvas} onMouseDown={() => this.drawLine()}/>
        );
    }
}

export default withStyles(styles, { withTheme: true }) (DrawingCanvas);