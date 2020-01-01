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
import { TFAVerify } from "../actions/authActions";
import { TFASetup } from "../actions/authActions";
import { getTFA } from "../actions/authActions";

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
    code: "",
    hasSetupTFA: false
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,

    clearErrors: PropTypes.func.isRequired,
    TFAVerify: PropTypes.func.isRequired,
    TFASetup: PropTypes.func.isRequired,
    getTFA: PropTypes.func.isRequired,
    isTFAing: PropTypes.bool,
    TFA: PropTypes.object
  };
  componentDidMount() {
    if (this.props.title === "Google Two-Factor Auth") {
      this.props.getTFA();
      // this.props.TFASetup();
    }
  }
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
    // this.props.twoFAVerify(code).then(authPromise => {
    //   // document.location.href = "/";
    //   this.setState({
    //     is2FA: true
    //   });
    // });

    //clear errors
    this.toggle();
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { classes, title, alertMsg, TFA } = this.props;

    // get TFA object from props for dispalying qrcode
    const { open, hasSetupTFA } = this.state;

    //stop this from getting lost in lambda expressions.
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
            {TFA ? <img src={TFA.TFA.dataURL} /> : null}
          </DialogContent>
          {title === "Google Two-Factor Auth" ? (
            <div
              style={{
                width: "100%",
                
              }}
            >
              {TFA ? (
                <DialogActions>
                  <TextField
                    autoFocus
                    variant="outlined"
                    label="enter code"
                    fullWidth
                  />
                  <Button autoFocus onClick={this.onSubmit} color="primary">
                    submit
                  </Button>
                </DialogActions>
              ) : null}
            </div>
          ) : (
            <DialogActions>
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
  error: state.error,
  TFA: state.auth.TFA,
  isTFAing: state.auth.isTFAing
});
export default connect(mapStateToProps, {
  TFAVerify,
  TFASetup,
  getTFA,
  clearErrors
})(withStyles(styles)(ResponsiveDialog));
