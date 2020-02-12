import { Slide } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import compose from "recompose/compose";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";
import "../../css3/bouncingEffect.css";
import ResponsiveDialog from "../ResponsiveDialog";
import RoleCheckboxes from "./RoleCheckboxes";

const theme = createMuiTheme({
  spacing: 4
});
const styles = {
  paper: {
    padding: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
};
class SignUp extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    msg: null,
    selectedRole: "",
    checked: false,
    company: ""
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    userLoaded: PropTypes.bool,
    clearErrors: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    successMsg: PropTypes.string,
    //withRouter
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // if (isAuthenticated) {
    //   this.toggle();
    // }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, email, password, selectedRole, company } = this.state;

    // Create user object
    const newUser = {
      name,
      email,
      password,
      role: selectedRole,
      company: company
    };

    // Attempt to register
    this.props.register(newUser);

    //clear errors.
    this.toggle();
  };

  render() {
    const { classes, error, isLoading } = this.props;
    const roleSelectedCallback = selectedRole => {
      this.setState({
        selectedRole: selectedRole
      });
    };
    return (
      <Container maxWidth="sm" className={classes.paper}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Tooltip title="click me :)">
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon className="animation" />
            </Avatar>
          </Tooltip>

          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {this.state.msg ? (
            <ResponsiveDialog alertMsg={this.state.msg} title={error.id} />
          ) : null}
          {!this.state.msg && this.props.successMsg ? (
            <ResponsiveDialog
              alertMsg={this.props.successMsg}
              title={"congrads!"}
            />
          ) : null}
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={this.onChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.onChange}
                />
              </Grid>
              <Grid item xs={12}>
                {this.state.selectedRole === "employer" ? (
                  <Slide direction="left" in={true}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="company"
                      label="company(optional)"
                      type="company"
                      id="company"
                      onChange={this.onChange}
                    />
                  </Slide>
                ) : null}
              </Grid>

              <RoleCheckboxes roleSelectedCallback={roleSelectedCallback} />
              {this.state.selectedRole !== "admin" &&
              this.state.selectedRole !== "" ? (
                <Slide in={true} direction="right">
                  <Grid container>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={() => {
                            this.setState({
                              checked: !this.state.checked
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="page views, downloads, login info will be stored in my mongodb database"
                    />
                  </Grid>
                </Slide>
              ) : null}
            </Grid>
            <Button
              disabled={this.state.selectedRole === "" && !this.state.checked}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.onSubmit}
            >
              Sign Up
            </Button>

            <Grid container justify="center">
              <Grid item>
                <NavLink to="/signin" variant="body2">
                  go back
                </NavLink>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  userLoaded: state.auth.userLoaded,
  isAuthenticated: state.auth.isAuthenticated,
  successMsg: state.auth.successMsg
});
export default compose(
  withStyles(styles),
  connect(mapStateToProps, { register, clearErrors })
)(withRouter(SignUp));
