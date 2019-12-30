import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//redux
import { twoFAVerify } from "../actions/authActions";
import { clearErrors } from "../actions/errorActions";

import MediaQuery from "react-responsive";
const theme = createMuiTheme({
  spacing: 4
});

const styles = {};

class ResponsiveDialog extends Component {
  state = {
    open: true,
    QRCode: "",
    code: ""
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    twoFAVerify: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }
  toggle = () => {
    // Clear errors
    this.props.clearErrors();
  };
  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };
  onSubmit = e => {
    e.preventDefault();

    const { code } = this.state;

    // Attempt to login
    this.props.twoFAVerify(code).then(authPromise => {
      // document.location.href = "/";
      this.setState({
        is2FA: true
      });
    });

    //clear errors
    this.toggle();
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  
  render() {
    const { classes, title, alertMsg } = this.props;
    const { open } = this.state;
    //stop this from getting lost in lambda expressions.
    const that = this;
    const dialog = isFullScreen => {
      return (
        <Dialog
          open={open}
          fullScreen={isFullScreen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{alertMsg}</DialogContentText>
          </DialogContent>
          {title === "Google Two-Factor Auth" ? (
            <DialogActions>
              <TextField
                autoFocus
                variant="outlined"
                fullWidth
                label="enter code"
              />
              <Button autoFocus onClick={this.onSubmit} color="primary">
                submit
              </Button>
            </DialogActions>
          ) : (
            <DialogActions className={{ justifyContent: "center" }}>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          )}
        </Dialog>
      );
    };
    return (
      <div>
        <MediaQuery query="(max-device-width: 1224px)">
          {dialog(true)}
        </MediaQuery>

        <MediaQuery query="(min-device-width: 1224px)">
          {dialog(false)}
        </MediaQuery>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});
export default connect(mapStateToProps, { twoFAVerify, clearErrors })(
  withStyles(styles)(ResponsiveDialog)
);
