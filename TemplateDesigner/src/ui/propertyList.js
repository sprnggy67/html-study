/**
 A list of properties
 */

'use strict';

var ds = ds || {};

/**
 * Constructs a new PropertyList with a root element ID
 * The properties within the list are defined when a component is selected.
 */
ds.PropertyList = function(rootElementID, typeLibrary, onPropertyChanged) {
	this.rootElementID = rootElementID;
	this.typeLibrary = typeLibrary;
	this.onPropertyChanged = onPropertyChanged;
	this.input = null;
}

ds.PropertyList.prototype.displayProperties = function(component) {

	// Clear the list
	this.input = component;
	$(this.rootElementID).html("");
	if (component == null)
		return;
	
	// Get the component type
	var componentType = this.typeLibrary.componentNamed(component.componentType);
	if (componentType == null) {
		console.log("Unable to find ctype in displayProperties: " + component.componentType);
		return;
	}

	// Get the property descriptors.
	var pdArray = componentType.getPropertyDescriptors();
	if (pdArray == null || pdArray.length == 0)
		return;

	// Create a copy of the property descriptors and add property values.
	pdArray = JSON.parse(JSON.stringify(pdArray));
	for (var i = 0; i < pdArray.length; i++) {
		var pd = pdArray[i];
		if (pd.type == ds.ComponentType.PROPERTY_BOOLEAN) {
			if (component[pd.name])
				pd.checked = "checked";
			else
				pd.checked = "";
		} else {
			pd.value = component[pd.name];
		}
	}

	// Display the properties.
	$(this.rootElementID).html($("#propertyListItemTemplate").render(pdArray));

	// Listen for property changes.
	var that = this;
	$(".propertyValue").change(function() {
		that.updateProperty(this);
	});
}

	/**
	 * Updates the property value for an element when it changes.
	 */
ds.PropertyList.prototype.updateProperty = function(element) {
	// Get the property value
	var value = element.value;
	if (element.type == "checkbox") {
		value = $(element).is(':checked') ? true : false;
	} else if (value == "") {
		value = null;
	}

	// Store it on the component
	var component = this.input;
	if (value == null) {
		delete component[element.dataset.prop_name];
	} else {
		component[element.dataset.prop_name] = value;
	}

	// Notify the listener of the property change.
	if (this.onPropertyChanged)
		this.onPropertyChanged(this, component);	
}

