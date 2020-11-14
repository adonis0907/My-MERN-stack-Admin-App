import { makeStyles, Paper } from "@material-ui/core";
import Breadcrumb from "components/shared/Breadcrumb";
import { i18n } from "i18n";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import SwaggerUI, { presets } from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { loadSwaggerUI } from "../../../actions/developerActions";

class Developer extends Component {
  componentDidMount() {
    this.props.loadSwaggerUI();

    if (this.props.swaggerUIDocs) {
      SwaggerUI({
        dom_id: "#swaggerContainer",
        spec: this.props.swaggerUIDocs,
        presets: [presets.apis],
      });
    }
  }

  componentDidUpdate(prevProps, prepStates, snapshot) {
    if (this.props.swaggerUIDocs) {
      SwaggerUI({
        dom_id: "#swaggerContainer",
        spec: this.props.swaggerUIDocs,
        presets: [presets.apis],
      });
    }
  }

  static propTypes = {
    swaggerUIDocs: PropTypes.object,
  };

  render() {
    return <DeveloperContent isSmallScreen={this.props.isSmallScreen} />;
  }
}

const mapStateToProps = (state) => ({
  swaggerUIDocs: state.developer.swaggerUIDocs,
});

export default connect(mapStateToProps, { loadSwaggerUI })(Developer);

/**
 * The support component. Used in the drawer list.
 *
 * @author Mark Zhu <zdy120939259@outlook.com>
 */
function DeveloperContent() {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "#E9EAED",
      width: "100%",
      //   backgroundColor: "black"
    },
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    paper: {
      backgroundColor: "white",
      padding: theme.spacing(1, 1),
      zIndex: 1,
      position: "relative",
    },

    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    expansionPanelHeader: {
      backgroundColor: "#3F51B5",
      color: "white",
    },
  }));

  const classes = useStyles();

  return (
    <>
      <Breadcrumb
        items={[[i18n("frame.menu"), "/"], [i18n("developer.route")]]}
      />
      <Paper className={classes.paper}>
        <div id="swaggerContainer" />
      </Paper>
    </>
  );
}
