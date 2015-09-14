
/**
 * Created by toby on 29/08/15.
 */

nqmTBX.EditSheet = React.createClass({
  propTypes: {
    resource: React.PropTypes.object
  },
  validateResource: function() {
    var errors = [];
    var resource = {};

    resource.name = this.refs.name.getValue();
    if (resource.name.length === 0) {
      errors.push("name is required");
    }

    resource.description = this.refs.description.getValue();
    resource.tags = this.refs.tags.getValue().split(/[\s,]+/);

    return { errors: errors, resource: resource };
  },
  save: function() {
    var valid = this.validateResource();
    if (valid.errors.length > 0) {
      nqmTBX.ui.notification(valid.errors);
    } else {
      var cb = function(err, result) {
        if (err) {
          nqmTBX.ui.notification("save failed: " + err.message, 2000);
        }
        if (result && result.ok) {
          nqmTBX.ui.notification("command sent",2000);
          FlowRouter.go("visualise");
        }
      };
      if (this.props.resource) {
        valid.resource.id = this.props.resource.id;
        Meteor.call("/app/visualisation/update", valid.resource, cb);
      } else {
        Meteor.call("/app/visualisation/create", valid.resource, cb);
      }
    }
  },
  cancel: function() {
    FlowRouter.go("visualise");
  },
  render: function() {
    var styles = {
      formRow: {
        padding: "4px"
      },
      textInput: {
        width: "100%"
      }
    };
    var FormRow = React.createClass({
      render: function() {
        return <div style={styles.formRow}>{this.props.children}</div>;
      }
    });

    return (
      <div>
        <h4>visualisation details</h4>
        <FormRow>
          <mui.TextField style={styles.textInput} ref="name" floatingLabelText="name" defaultValue={this.props.resource.name} />
        </FormRow>
        <FormRow>
          <mui.TextField style={styles.textInput} ref="description"  multiLine={true} floatingLabelText="description" defaultValue={this.props.resource.description} />
        </FormRow>
        <FormRow>
          <mui.TextField style={styles.textInput} ref="tags" floatingLabelText="tags" defaultValue={this.props.resource.tags} />
        </FormRow>
        <FormRow>
          <mui.RaisedButton label="save" primary={true} onClick={this.save} />
          <mui.RaisedButton label="cancel" onClick={this.cancel} style={{float: "right"}} />
        </FormRow>
      </div>
    );
  }
});