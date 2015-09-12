/**
 * Created by toby on 29/08/15.
 */

const {
  Card,
  CardText,
  CardTitle,
  TextField,
  RaisedButton
  } = mui;

EditDataset = React.createClass({
  propTypes: {
    dataset: React.PropTypes.object
  },
  flattenIndex: function(uniqueIndex) {
    var flat = [];
    _.forEach(uniqueIndex, function(i) {
      flat.push(i.asc ? i.asc : i.desc);
    });
    return flat.join(", ");
  },
  validateDataset: function() {
    var errors = [];
    var dataset = {};

    dataset.name = this.refs.name.getValue();
    if (dataset.name.length === 0) {
      errors.push("name is required");
    }

    dataset.description = this.refs.description.getValue();
    dataset.tags = this.refs.tags.getValue().split(/[\s,]+/);

    var idx = this.refs.uniqueIndex.getValue().split(/[\s,]+/);
    if (idx.length === 0) {
      errors.push("specify at least one unique key field");
    } else {
      dataset.uniqueIndex = [];
      // ToDo - support ascending/descending specification.
      _.forEach(idx, function(i) {
        if (i.length > 0) {
          dataset.uniqueIndex.push({ "asc": i });
        }
      });
    }
    var schema;
    try {
      schema = JSON.parse(this.refs.scheme.getValue() || "{}");
      dataset.schema = schema;
    } catch (e) {
      errors.push("invalid schema: " + e.message);
    }

    return { errors: errors, dataset: dataset };
  },
  save: function() {
    var valid = this.validateDataset();
    if (valid.errors.length > 0) {
      console.log(valid.errors);
    } else {
      var cb = function(err, result) {
        if (err) {
          nqmTBX.ui.notification("save failed: " + err.message, 2000);
        }
        if (result && result.ok) {
          nqmTBX.ui.notification("command sent",2000);
          FlowRouter.go("/datasets");
        }
      };

      if (this.props.dataset) {
        valid.dataset.id = this.props.dataset.id;
        Meteor.call("/app/dataset/update", valid.dataset, cb);
      } else {
        Meteor.call("/app/dataset/create", valid.dataset, cb);
      }
    }
  },
  cancel: function() {
    FlowRouter.go("/datasets");
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
        <h4>dataset details</h4>
        <FormRow>
          <TextField style={styles.textInput} ref="name" hintText="dataset name" floatingLabelText="name" defaultValue={this.props.dataset.name} />
        </FormRow>
        <FormRow>
          <TextField style={styles.textInput} ref="description" hintText="dataset description"  multiLine={true} floatingLabelText="description" defaultValue={this.props.dataset.description} />
        </FormRow>
        <FormRow>
          <TextField style={styles.textInput} ref="tags" hintText="tags" floatingLabelText="tags" defaultValue={this.props.dataset.tags} />
        </FormRow>
        <FormRow>
          <TextField style={styles.textInput} ref="scheme" hintText="schema" floatingLabelText="schema" multiLine={true} defaultValue={JSON.stringify(this.props.dataset.scheme,null,2)} />
        </FormRow>
        <FormRow>
          <TextField style={styles.textInput} ref="uniqueIndex" hintText="unique index" floatingLabelText="unique index" defaultValue={this.flattenIndex(this.props.dataset.uniqueIndex)} />
        </FormRow>
        <FormRow>
          <RaisedButton label="save" primary={true} onClick={this.save} />
          <RaisedButton label="cancel" onClick={this.cancel} style={{float: "right"}} />
        </FormRow>
      </div>
    );
  }
});