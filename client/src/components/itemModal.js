import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { connect } from "react-redux";
import { addItem } from "../actions/itemActions";
// import uuid from 'uuid';
class ItemModal extends Component {
  state = {
    modal: false,
    name: ""
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
      e.preventDefault();

      const newItem = {
        //   id: uuid(),
          name: this.state.name
      }

      // add item via addItem action
      this.props.addItem(newItem);

      // close modal
      this.toggle();
  }
  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{ marginBottom: "2rem" }}
          onClick={this.toggle}
        >
          add item
        </Button>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>add to shopping list</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="item">Item</Label>
                <Input
                  type="text"
                  name="name"
                  id="item"
                  placeholder="add shopping item"
                  onChange={this.onChange}
                ></Input>
                <Button color="dark" style={{ marginTop: '2rem' }} block>
                    add item
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}


  const mapStateToProps = state => ({
    item: state.item
  });
export default connect(mapStateToProps, { addItem })(ItemModal);
