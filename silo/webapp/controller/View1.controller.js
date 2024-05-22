sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.jec.silo.controller.View1", {
            onInit: function () {
                // this.demoCreate();
                let oSiloModel = new sap.ui.model.json.JSONModel();
                oSiloModel.setData({
                    silos: [
                        { material: "material-1", height: 0, targetHeight: 50, materialName: "Material 1" },
                        { material: "material-2", height: 0, targetHeight: 100,materialName: "Material 2" }
                    ]
                })
                this.getView().setModel(oSiloModel, "siloModel");
                let oSiloFormModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oSiloFormModel, "siloFormModel");
            },
            _demoCreate: function () {
                let oDataModel = this.getOwnerComponent().getModel();
                let payload = {
                    "MaxHeight": "1598",
                    "Currentheight": "976",
                    "Materialid": "CRUDE_OIL"
                }
                // Example of creating a record
                oDataModel.create("/SiloSet", payload, {
                    success: (oData, response) => {
                        console.log("Success");
                        let result = oData.Siloid;
                        sap.m.MessageToast.show("Silo Created with ID: " + result);

                    },
                    error: (oError) => {
                        console.log("Error");
                    }
                })
                // Example of updating a record
                oDataModel.update("/SiloSet(Siloid='000016',MaxHeight=1598l)", payload, {
                    success: (oData, response) => {
                        console.log("Success");
                        let result = oData.Siloid;
                        sap.m.MessageToast.show("Silo Created with ID: " + result);

                    },
                    error: (oError) => {
                        console.log("Error");
                    }
                })
            },
            formatHeight: function (height) {
                return `${height}%`
            },
            onAfterRendering: function () {
                const SilosHBox = this.byId('idSilosHBox');
                const oSiloModel = this.getView().getModel("siloModel");
                const Silos = oSiloModel.getProperty('/silos');
                if (SilosHBox.getItems().length)
                    Silos.forEach((oSilo, index) => {
                        SilosHBox.getItems()[index].addStyleClass(oSilo.material);
                    });

                setTimeout(() => {
                    Silos.forEach((oSilo, index) => {
                        // oSilo.height = oSilo.targetHeight;
                        oSiloModel.setProperty(`/silos/${index}/height`, oSilo.targetHeight);
                    })
                    // oSiloModel.refresh(); 
                }, 100);
                
            },
            onMaterialSelectionChange: function (oEvent) {
                const selectedMaterialId = oEvent.getSource().getSelectedKey();
                const Silos = this.getView().getModel("siloModel").getProperty('/silos');
                const selectedSilo = Silos.find(silo => silo.material === selectedMaterialId);
                const oSiloFormModel = this.getView().getModel("siloFormModel");
                oSiloFormModel.setData(selectedSilo);
            },
            onMaterialNameLiveChange: function (oEvent) {
                const materialName = oEvent.getParameter('newValue');
                const oSiloFormModel = this.getView().getModel("siloFormModel");
                const materialId = oSiloFormModel.getProperty('/material');
                const oSiloModel = this.getView().getModel("siloModel");
                const Silos = oSiloModel.getProperty('/silos');
                const selectedSilo = Silos.find(silo => silo.material === materialId);
                selectedSilo.materialName = materialName;
                oSiloModel.refresh();
            },
            onMaterialHeightLiveChange: function (oEvent) {
                const height = oEvent.getParameter('newValue');
                const validateHeight = this.validateHeight(height, oEvent.getSource());
                if (!validateHeight) return;
                oEvent.getSource().setValueState("None");    
                const oSiloFormModel = this.getView().getModel("siloFormModel");
                const materialId = oSiloFormModel.getProperty('/material');
                const oSiloModel = this.getView().getModel("siloModel");
                const Silos = oSiloModel.getProperty('/silos');
                const selectedSilo = Silos.find(silo => silo.material === materialId);
                selectedSilo.height = height;
                oSiloModel.refresh();
            },
            validateHeight: function (height, oSource) {
                if (!height) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText("Height is required");
                    return false;
                }
                if (parseInt(height) > 100) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText("Height should be less than 100%");
                    return false;
                }
                if (parseInt(height) < 0) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText("Height should be greater than 0%");
                    return false;
                }
                if (isNaN(parseInt(height))) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText("Height should be a number");
                    return false;
                }
                return true;
            }
                
        });
    });
